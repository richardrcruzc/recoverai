import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/collectflowai-logo.png';
import { getToken, logout } from '../lib/auth';

const publicLinks = [
  { to: '/#pricing', label: 'Pricing' },
  { to: '/demo', label: 'Try Demo' },
  { to: '/onboarding', label: 'Onboarding' }
];

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/payments', label: 'Payments' },
  { to: '/collections', label: 'Collections' }
];

const automationLinks = [
  { to: '/reminders', label: 'Reminders' },
  { to: '/scoring', label: 'Scoring' },
  { to: '/email-automation', label: 'Email Automation' },
  { to: '/outbound', label: 'Outbound' }
];

const adminLinks = [
  { to: '/reports', label: 'Reports' },
  { to: '/sales', label: 'Sales' },
  { to: '/billing', label: 'Billing' },
  { to: '/lead-research', label: 'Lead Research' },
  { to: '/imports/invoices', label: 'Import Invoices' },
  { to: '/leads/import', label: 'Import Leads' }
];

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const base = 'block rounded-xl px-3 py-2 text-sm font-medium transition';

  if (to.includes('#')) {
    return (
      <a href={to} onClick={onClick} className={`${base} text-slate-600 hover:bg-slate-100`}>
        {label}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function DesktopDropdown({
  label,
  links
}: {
  label: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
        {links.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </div>
    </div>
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="CollectFlowAI"
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {isLoggedIn ? (
            <>
              {mainLinks.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
              <DesktopDropdown label="Automation" links={automationLinks} />
              <DesktopDropdown label="Admin" links={adminLinks} />
            </>
          ) : (
            publicLinks.map((link) => <NavItem key={link.to} {...link} />)
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Open App
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                to="/onboarding"
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Start Setup
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-2xl border border-slate-300 p-2 text-slate-900 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          {!isLoggedIn ? (
            <nav className="grid gap-2">
              {publicLinks.map((link) => (
                <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
              ))}
            </nav>
          ) : (
            <nav className="space-y-5">
              <MobileSection title="Main" links={mainLinks} onClick={() => setOpen(false)} />
              <MobileSection title="Automation" links={automationLinks} onClick={() => setOpen(false)} />
              <MobileSection title="Admin" links={adminLinks} onClick={() => setOpen(false)} />
            </nav>
          )}

          <div className="mt-5 grid gap-2 border-t border-slate-200 pt-4">
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

function MobileSection({
  title,
  links,
  onClick
}: {
  title: string;
  links: { to: string; label: string }[];
  onClick: () => void;
}) {
  return (
    <section>
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </div>

      <div className="grid gap-1">
        {links.map((link) => (
          <NavItem key={link.to} {...link} onClick={onClick} />
        ))}
      </div>
    </section>
  );
}