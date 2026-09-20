// Single source of truth for talking to the backend.
//
// Previously the API base URL was redefined separately in LoginPage,
// AccountPage, AdminDashboard and AdminProducts — easy to drift out of
// sync if one gets changed and the others don't. Import from here instead.
//
// `apiFetch` also centralises the three things every call needs:
//   1. the Bearer token (read straight from the persisted auth store, so
//      callers don't have to thread `token` through props),
//   2. JSON encoding/decoding,
//   3. turning a non-2xx response into a thrown Error carrying the
//      server's own message, so pages can just try/catch.

import { useAuthStore } from '../store';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * @param {string} path      e.g. '/orders/my' (leading slash, no /api prefix)
 * @param {object} [options]
 * @param {boolean} [options.auth=false]  attach the Bearer token
 */
export async function apiFetch(path, { auth = false, headers, body, ...rest } = {}) {
  const finalHeaders = { ...headers };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // fetch() only rejects on network-level failure — surface something
    // readable instead of the browser's generic "Failed to fetch".
    throw new ApiError(
      'Could not reach the server. Please check your connection and try again.',
      0,
      null
    );
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch (_) { data = { message: text }; }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      // Token expired or revoked — clear it so the UI can redirect to login
      // instead of retrying with a dead token forever.
      useAuthStore.getState().logout();
    }
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data);
  }

  return data;
}

export const api = {
  get:  (path, opts) => apiFetch(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
  put:  (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
  del:  (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' }),
};
