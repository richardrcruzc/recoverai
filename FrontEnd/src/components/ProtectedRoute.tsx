import { Navigate } from 'react-router-dom';
import { getToken } from '../lib/auth';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const token = getToken();

  // 🚨 NOT LOGGED IN → redirect immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow access
  return <>{children}</>;
}