import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
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
    <main className="min-h-screen bg-ivory flex">
      {/* Left — decorative */}
      <div
        className="hidden lg:block lg:w-1/2 bg-charcoal relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, #1C1B1A 0%, #2d2b29 100%)`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
          <Link to="/" className="font-serif text-4xl font-light tracking-[0.2em] uppercase text-ivory mb-6">
            GŌKANA
          </Link>
          <div className="w-12 h-px bg-gold mb-8" />
          <p className="font-serif text-2xl font-light text-ivory/70 leading-relaxed">
            "Every gift tells a story.<br />Make yours unforgettable."
          </p>
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="font-sans text-xs text-ivory/20 tracking-[0.2em] uppercase">Premium Gifting · India</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-gold/10 rounded-full" />
        <div className="absolute bottom-32 right-16 w-48 h-48 border border-gold/5 rounded-full" />
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo on mobile */}
          <Link to="/" className="lg:hidden block font-serif text-2xl font-light tracking-[0.15em] uppercase text-charcoal mb-10 text-center">
            GŌKANA
          </Link>

          <p className="label-text text-gold/70 mb-3">
            {mode === 'login' ? '✦ Welcome Back' : '✦ Create Account'}
          </p>
          <h1 className="font-serif text-4xl font-light text-charcoal mb-2">
            {mode === 'login' ? 'Sign In' : 'Join GŌKANA'}
          </h1>
          <p className="font-sans text-sm text-charcoal/45 mb-10">
            {mode === 'login'
              ? 'Sign in to manage your orders and wishlist.'
              : 'Create your account for a seamless gifting experience.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block font-sans text-xs text-charcoal/50 mb-2 tracking-[0.1em] uppercase">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  required
                  placeholder="Priya Menon"
                  className="input-premium"
                />
              </div>
            )}

            <div>
              <label className="block font-sans text-xs text-charcoal/50 mb-2 tracking-[0.1em] uppercase">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="you@example.com"
                className="input-premium"
              />
            </div>

            <div>
              <label className="block font-sans text-xs text-charcoal/50 mb-2 tracking-[0.1em] uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="input-premium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-sm text-red-600 bg-red-50 px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-8 text-center font-sans text-sm text-charcoal/50">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-charcoal font-medium hover:text-gold transition-colors"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-charcoal font-medium hover:text-gold transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          <div className="mt-10 pt-8 border-t border-charcoal/10 text-center">
            <Link to="/" className="font-sans text-xs text-charcoal/30 hover:text-charcoal transition-colors">
              ← Back to GŌKANA
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
