import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import ThankYou from './pages/ThankYou';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import AdminUsers from './pages/AdminUsers';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Reminders from './pages/Reminders';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Scoring from './pages/Scoring';  
import Demo from './pages/Demo';
import Onboarding from './pages/Onboarding';
import Billing from './pages/Billing';
import EmailAutomation from './pages/EmailAutomation';
import Collections from './pages/Collections';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/onboarding" element={<Onboarding />} />

<Route
  path="/collections"
  element={
    <ProtectedRoute>
      <Collections />
    </ProtectedRoute>
  }
/>
<Route
  path="/email-automation"
  element={
    <ProtectedRoute>
      <EmailAutomation />
    </ProtectedRoute>
  }
/>

   <Route
  path="/billing"
  element={
    <ProtectedRoute>
      <Billing />
    </ProtectedRoute>
  }
/>
     <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads/:id"
        element={
          <ProtectedRoute>
            <LeadDetail />
          </ProtectedRoute>
        }
      />
      <Route
  path="/invoices"
  element={
    <ProtectedRoute>
      <Invoices />
    </ProtectedRoute>
  }
/>

<Route
  path="/reminders"
  element={
    <ProtectedRoute>
      <Reminders />
    </ProtectedRoute>
  }
/>
<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>
<Route
  path="/scoring"
  element={
    <ProtectedRoute>
      <Scoring />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}
