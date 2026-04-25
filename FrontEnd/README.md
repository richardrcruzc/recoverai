# RecoverAI Frontend Leads Admin

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
