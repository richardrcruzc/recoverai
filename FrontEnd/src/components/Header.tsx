
import logo from '../assets/recoverai-logo.svg';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <a href="/" className="flex items-center gap-3">
          <img src={logo} alt="RecoverAI" className="h-11 w-auto" />
          <div className="hidden sm:block">
            <div className="text-xs text-slate-500">AI collections for service businesses</div>
          </div>
        </a>

        <nav className="hidden gap-6 text-sm md:flex">
          <a href="/#how" className="hover:text-slate-600">How it works</a>
          <a href="/#pricing" className="hover:text-slate-600">Pricing</a>
          <a href="/#faq" className="hover:text-slate-600">FAQ</a>
        </nav>

        <a
          href="/#cta"
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          Book a Demo
        </a>
      </div>
    </header>
  );
}
