'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/public/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <Logo size="lg" />
          <p className="mt-6 text-muted text-sm font-accent tracking-[0.2em] uppercase">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-accent tracking-wider uppercase text-muted mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground placeholder:text-muted-dark focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
              placeholder="admin@24moments.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-accent tracking-wider uppercase text-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground placeholder:text-muted-dark focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-background font-accent text-sm tracking-[0.2em] uppercase py-3 rounded-[3px] hover:bg-gold-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
