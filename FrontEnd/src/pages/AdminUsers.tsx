import Header from '../components/Header';

const users = [
  {
    name: 'Richard Cruz',
    email: 'info@recoverAI.net',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Sales User',
    email: 'sales@recoverAI.net',
    role: 'Sales',
    status: 'Pending'
  }
];

export default function AdminUsers() {
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

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Admin Users', users.length],
            ['Active Users', users.filter((x) => x.status === 'Active').length],
            ['Pending Invites', users.filter((x) => x.status === 'Pending').length]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="mt-1 text-sm text-slate-500">
                Placeholder user administration module. Authentication and real user persistence can be added next.
              </p>
            </div>

            <button
              type="button"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Invite User
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-slate-100">
                    <td className="py-4 font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
