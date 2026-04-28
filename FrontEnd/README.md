# CollectFlowAIFrontend Leads Admin

Pages:
- `/`
- `/thank-you`
- `/dashboard`
- `/leads`
- `/leads/:id`

Run:

```bash
npm install
cp .env.example .env
npm run dev
```

Backend expected:

```env
VITE_API_BASE_URL=https://localhost:7001
```

Endpoints used:
- `POST /api/leads`
- `GET /api/leads`
- `PATCH /api/leads/{id}/status`


## Protected routes

These routes require login:

```text
/dashboard
/admin/users
/leads
/leads/:id
```

Demo login:

```text
admin@collectflowai .net
admin123
```

This is frontend-only demo protection using `localStorage`. For production, replace it with backend JWT authentication.
