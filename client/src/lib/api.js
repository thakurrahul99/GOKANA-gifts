// Single source of truth for the API base URL. Previously this was
// redefined separately in LoginPage, AccountPage, AdminDashboard and
// AdminProducts — easy to drift out of sync if one gets changed and the
// others don't. Import API_BASE from here instead.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
