import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} CollectFlowAI Send Campaign. All rights reserved.
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/terms" className="hover:text-slate-900">Terms</Link>
          <Link to="/privacy" className="hover:text-slate-900">Privacy</Link>
          <Link to="/acceptable-use" className="hover:text-slate-900">Acceptable Use</Link>
        </div>
      </div>
    </footer>
  );
}