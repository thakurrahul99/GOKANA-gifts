import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store';
import { API_BASE } from '../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const API = API_BASE;

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

      if (!res.ok) throw new Error(data.message || 'Authentication failed. Please check your credentials.');

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
    <main className="min-h-screen bg-bg flex">
      {/* Left — Midnight Navy decorative hero */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col items-center justify-center p-16 text-center text-surface"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(243,217,212,0.08) 0%, transparent 50%)`,
        }}
      >
        <div className="relative z-10 max-w-md">
          <Link
            to="/"
            className="inline-block font-serif text-4xl font-light tracking-[0.25em] uppercase text-surface mb-6 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            GŌKANA
          </Link>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-8" />
          <blockquote className="font-serif text-2xl font-light text-surface/80 leading-relaxed italic mb-8">
            "Every gift tells a story.<br />Make yours unforgettable."
          </blockquote>
          <div className="flex items-center justify-center gap-6 text-xs text-surface/50 tracking-wider uppercase">
            <span>✦ Handcrafted</span>
            <span>✦ Artisanal</span>
            <span>✦ Pan-India Delivery</span>
          </div>
        </div>

        {/* Decorative ambient elements */}
        <div className="absolute -top-12 -left-12 w-64 h-64 border border-accent/15 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-accent/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="font-sans text-[11px] text-surface/40 tracking-[0.2em] uppercase">
            Luxury Gifting Atelier · India
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-surface p-8 sm:p-10 border border-border shadow-sm"
        >
          {/* Logo on mobile */}
          <Link
            to="/"
            className="lg:hidden block font-serif text-2xl font-light tracking-[0.18em] uppercase text-primary mb-8 text-center"
          >
            GŌKANA
          </Link>

          <div className="mb-8">
            <span className="inline-block text-xs font-medium tracking-[0.15em] text-accent uppercase mb-2">
              {mode === 'login' ? '✦ Welcome Back' : '✦ Create Account'}
            </span>
            <h1 className="font-serif text-3xl font-normal text-primary mb-2">
              {mode === 'login' ? 'Sign In' : 'Join GŌKANA'}
            </h1>
            <p className="font-sans text-sm text-muted">
              {mode === 'login'
                ? 'Sign in to access your orders, saved addresses, and wishlist.'
                : 'Create your account for personalized gifting and tracking.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="reg-name"
                  className="block font-sans text-xs font-semibold text-text mb-2 uppercase tracking-wider"
                >
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoComplete="name"
                  placeholder="Priya Menon"
                  className="w-full px-4 py-3 bg-surface border border-border text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all placeholder:text-muted/60"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block font-sans text-xs font-semibold text-text mb-2 uppercase tracking-wider"
              >
                Email Address <span className="text-accent">*</span>
              </label>
              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-surface border border-border text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all placeholder:text-muted/60"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block font-sans text-xs font-semibold text-text mb-2 uppercase tracking-wider"
              >
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 pr-12 bg-surface border border-border text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all placeholder:text-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-muted hover:text-primary transition-colors min-w-[44px] min-h-[44px]"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm"
                role="alert"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-error" />
                <p className="font-sans text-xs leading-relaxed font-medium">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Please wait…
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center font-sans text-sm text-muted">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-primary font-semibold hover:text-accent underline underline-offset-4 transition-colors p-1"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-primary font-semibold hover:text-accent underline underline-offset-4 transition-colors p-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-sans text-xs text-muted hover:text-primary transition-colors p-2"
            >
              ← Back to GŌKANA
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
