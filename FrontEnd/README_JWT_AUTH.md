# React JWT Auth Update

This frontend now uses backend JWT auth.

## Flow

1. `/login` posts to `POST /api/auth/login`
2. Backend returns JWT
3. Frontend stores token in localStorage
4. Protected API calls include:

```http
Authorization: Bearer TOKEN
```

## Protected routes

```text
/dashboard
/admin/users
/leads
/leads/:id
```

## Public route

```text
POST /api/leads
```

The landing page lead form remains public.
