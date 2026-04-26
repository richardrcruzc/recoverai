import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/recoverai-logo.svg';
import { getToken, logout } from '../lib/auth';

const publicLinks = [
  { to: '/#pricing', label: 'Pricing' },
  { to: '/demo', label: 'Try Demo' },
  { to: '/onboarding', label: 'Onboarding' }
];

const appLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/payments', label: 'Payments' },
  { to: '/reminders', label: 'Reminders' },
  { to: '/reports', label: 'Reports' },
  { to: '/scoring', label: 'Scoring' },
  { to: '/billing', label: 'Billing' } ,
   { to: '/email-automation', label: 'Email Automation' }  ,
    { to: '/collections', label: 'Collections' }
];

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const base =
    'rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900';

  if (to.includes('#')) {
    return (
      <a href={to} onClick={onClick} className={`${base} text-slate-600`}>
        {label}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} ${isActive ? 'bg-slate-900 text-white hover:bg-slate-900 hover:text-white' : 'text-slate-600'}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const links = isLoggedIn ? [...publicLinks, ...appLinks] : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="RecoverAI" className="h-10 w-auto shrink-0 sm:h-11" />
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-sm font-semibold text-slate-900">RecoverAI</div>
            <div className="truncate text-xs text-slate-500">AI collections for service businesses</div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-2xl border border-slate-300 p-2 text-slate-900 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="grid gap-2">
            {links.map((link) => (
              <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
            ))}
          </nav>

          <div className="mt-4 grid gap-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-900"
              >
                Login
              </Link>
            )}

            <Link
              to={isLoggedIn ? '/dashboard' : '/onboarding'}
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white"
            >
              {isLoggedIn ? 'Open App' : 'Start Setup'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}