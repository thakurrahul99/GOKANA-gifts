import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Gift } from 'lucide-react';
import { useAuthStore } from '../store';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      login(data.user, data.token);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <main className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel — decorative navy */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16 text-center"
        style={{ background: 'var(--primary)' }}
      >
        <Link
          to="/"
          className="font-serif text-4xl font-light tracking-[0.2em] uppercase mb-6 focus-visible:outline-none focus-visible:rounded"
          style={{ color: '#FFFFFF' }}
        >
          GŌKANA
        </Link>
        <div className="h-px w-12 mb-8" style={{ background: 'var(--accent)' }} />
        <p className="font-serif text-2xl font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          "Every gift tells a story.<br />Make yours unforgettable."
        </p>

        <div className="absolute bottom-12 left-0 right-0 text-center">
          <p className="font-sans text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Premium Gifting · India
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ border: '1px solid rgba(212,175,55,0.12)' }} />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full" style={{ border: '1px solid rgba(212,175,55,0.07)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.04)' }} />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo on mobile */}
          <Link
            to="/"
            className="lg:hidden block font-serif text-2xl font-light tracking-[0.15em] uppercase mb-10 text-center focus-visible:outline-none focus-visible:rounded"
            style={{ color: 'var(--primary)' }}
          >
            GŌKANA
          </Link>

          <p className="label-text mb-3" style={{ color: 'var(--accent)' }}>
            {mode === 'login' ? '✦ Welcome Back' : '✦ Create Account'}
          </p>
          <h1 className="font-serif text-4xl font-light mb-2" style={{ color: 'var(--text-strong)' }}>
            {mode === 'login' ? 'Sign In' : 'Join GŌKANA'}
          </h1>
          <p className="font-sans text-sm mb-10" style={{ color: 'var(--muted)' }}>
            {mode === 'login'
              ? 'Sign in to manage your orders and wishlist.'
              : 'Create your account for a seamless gifting experience.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {mode === 'register' && (
              <div>
                <label htmlFor="reg-name" className="form-label">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  required
                  placeholder="Priya Menon"
                  className="input-premium"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="you@example.com"
                className="input-premium"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="input-premium pr-10"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-200 p-2 focus-visible:outline-none focus-visible:rounded"
                  style={{ color: 'var(--muted-2)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-2)'; }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-sm px-4 py-3 rounded-lg"
                style={{ color: 'var(--error)', background: '#FEE2E2' }}
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-8 text-center font-sans text-sm" style={{ color: 'var(--muted)' }}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          <div className="mt-10 pt-8 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <Link
              to="/"
              className="font-sans text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
              style={{ color: 'var(--muted-2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-2)'; }}
            >
              ← Back to GŌKANA
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
