import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState('Processing unsubscribe request...');

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      setMessage('Invalid unsubscribe link.');
      return;
    }

    fetch(`${API_BASE_URL}/api/unsubscribe`, {
      method: 'POST',
      credentials: 'include', // 👈 REQUIRED
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(async (response) => {
        const data = await response.json();
        setMessage(data.message || 'Your request has been processed.');
      })
      .catch(() => setMessage('Could not process unsubscribe request.'));
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Email Preferences</h1>
          <p className="mt-4 text-slate-600">{message}</p>
        </div>
      </main>
    </div>
  );
}