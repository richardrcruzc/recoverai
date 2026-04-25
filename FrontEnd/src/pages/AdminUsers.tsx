import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { createAdminUser, getAdminUsers, setAdminUserStatus } from '../lib/adminUsersApi';
import type { AdminUser, CreateAdminUserRequest } from '../types/adminUser';

const roles = ['Admin', 'Sales', 'Operations', 'Viewer'];

const initialForm: CreateAdminUserRequest = {
  fullName: '',
  email: '',
  password: '',
  role: 'Viewer'
};

function formatDate(value?: string | null): string {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function normalizeRole(role: string | number): string {
  if (typeof role === 'string') return role;

  const map: Record<number, string> = {
    1: 'Admin',
    2: 'Sales',
    3: 'Operations',
    4: 'Viewer'
  };

  return map[role] ?? 'Viewer';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<CreateAdminUserRequest>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((x) => x.isActive).length,
      inactive: users.filter((x) => !x.isActive).length,
      admins: users.filter((x) => normalizeRole(x.role) === 'Admin').length
    };
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load admin users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const updateForm = <K extends keyof CreateAdminUserRequest>(
    key: K,
    value: CreateAdminUserRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
    setError('');
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Full name, email, and password are required.');
      setSaving(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      setSaving(false);
      return;
    }

    try {
      await createAdminUser(form);
      setForm(initialForm);
      setMessage('Admin user created.');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create admin user.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    setMessage('');
    setError('');

    try {
      await setAdminUserStatus(user.id, !user.isActive);
      setMessage(user.isActive ? 'User deactivated.' : 'User activated.');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update user status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Administration</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Admin User</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage internal users who can access the RecoverAI admin dashboard, lead pipeline, and future customer and invoice modules.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ['Admin Users', metrics.total],
            ['Active Users', metrics.active],
            ['Inactive Users', metrics.inactive],
            ['Admins', metrics.admins]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Admin User</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add a user who can sign into the protected admin area.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Jane Smith"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="jane@recoverai.net"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Temporary password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="At least 8 characters"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                <select
                  value={form.role}
                  onChange={(e) => updateForm('role', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Users are loaded from the backend using the JWT token.
                </p>
              </div>

              <button
                type="button"
                onClick={loadUsers}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {message ? (
              <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>
            ) : null}

            {error ? (
              <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
            ) : null}

            {loading ? (
              <p className="mt-6 text-slate-600">Loading users...</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3">Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100">
                        <td className="py-4 font-medium">{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{normalizeRole(user.role)}</td>
                        <td>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDate(user.lastLoginAtUtc)}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => toggleStatus(user)}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium transition hover:bg-slate-50"
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 ? (
                  <p className="py-10 text-center text-slate-500">No admin users found.</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
