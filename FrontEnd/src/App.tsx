import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import ThankYou from './pages/ThankYou';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/leads/:id" element={<LeadDetail />} />
    </Routes>
  );
}
