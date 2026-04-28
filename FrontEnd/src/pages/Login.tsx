import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { login } from '../lib/auth';
import Footer from '../components/Footer';

type LocationState = {
  from?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [email, setEmail] = useState('admin@collectflowai.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const returnTo = state?.from ?? '/dashboard';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const ok = await login(email, password);

      if (!ok) {
        setError('Invalid email or password.');
        return;
      }

      navigate(returnTo, { replace: true });
    } catch {
      setError('Could not connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-xl items-center px-6 py-16">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Admin Access</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-3 text-slate-600">
            Dashboard and leads are protected by backend JWT authentication.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

           
        </section>
      </main>
       <div className="min-h-screen bg-slate-50 text-slate-900">  
            <Footer />
          </div>
    </div>
  );
}
