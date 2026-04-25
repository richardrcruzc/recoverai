import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/recoverai-logo.svg';
import { getToken, logout } from '../lib/auth';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="RecoverAI" className="h-11 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">RecoverAI</div>
            <div className="text-xs text-slate-500">AI collections for service businesses</div>
          </div>
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          <Link to="/#pricing" className="hover:text-slate-600">Pricing</Link>
          <Link to="/demo" className="hover:text-slate-600">Try Demo</Link>
          <Link to="/Onboarding" className="hover:text-slate-600">Onboarding</Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-slate-600">Dashboard</Link>
              <Link to="/customers" className="hover:text-slate-600">Customers</Link>
              <Link to="/invoices" className="hover:text-slate-600">Invoices</Link>
              <Link to="/payments" className="hover:text-slate-600">Payments</Link>
              <Link to="/reminders" className="hover:text-slate-600">Reminders</Link>
              <Link to="/reports" className="hover:text-slate-600">Reports</Link>
              <Link to="/scoring" className="hover:text-slate-600">Scoring</Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Login
            </Link>
          )}

          <Link
            to={isLoggedIn ? '/dashboard' : '/onboarding'}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            {isLoggedIn ? 'Open App' : 'Start Setup'}
          </Link>
        </div>
      </div>
    </header>
  );
}