# RecoverAI Pro

React + Vite + Tailwind landing page with logo integrated, routing, lead form validation, thank-you page, and API-ready lead capture flow.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Logo

The RecoverAI logo is located at:

```text
src/assets/recoverai-logo.svg
```

It is already wired into the header navigation.

## API integration

The lead form currently posts to:

```text
${VITE_API_BASE_URL}/api/leads
```

If the backend is unavailable, the lead is stored locally in `localStorage` as a fallback so the demo still works.

Update `.env`:

```env
VITE_API_BASE_URL=https://localhost:5001
VITE_CALENDLY_URL=https://calendly.com/your-link/recoverai-demo
```
