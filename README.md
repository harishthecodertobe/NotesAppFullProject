# Notes App — MERN Stack

A full-stack notes application: React (Vite) frontend + Node/Express/MongoDB backend,
with cookie-based JWT authentication and complete note CRUD.

## Final folder structure

```
NotesAppProject/
├── BackEnd/
│   ├── .env                          # MONGO_URI, JWT_SECRET, PORT, CLIENT_URL
│   ├── package.json
│   ├── server.js                     # entry point
│   └── src/
│       ├── app.js                    # express app, CORS + middleware wiring
│       ├── config/database.js        # mongoose connection
│       ├── controllers/
│       │   ├── auth.controller.js    # register, login, logout, getCurrentUser
│       │   └── notes.controller.js   # create, getAll, getSingle, update, delete
│       ├── middleware/auth.middleware.js  # verifies JWT cookie, attaches req.user
│       ├── models/
│       │   ├── user.model.js
│       │   └── note.model.js
│       ├── routes/
│       │   ├── auth.routes.js        # /api/auth/*
│       │   └── notes.routes.js       # /api/notes/*
│       └── utils/generateToken.js
│
└── Client/client/
    ├── .env                          # VITE_API_URL
    ├── package.json
    ├── index.html
    └── src/
        ├── api/
        │   ├── axios.js              # centralized axios instance
        │   └── notes.js              # notes endpoint wrappers
        ├── context/
        │   ├── auth-context.js       # React context object
        │   └── AuthContext.jsx       # AuthProvider (register/login/logout/session restore)
        ├── hooks/useAuth.js          # useAuth() hook
        ├── components/
        │   ├── Navbar.jsx
        │   ├── NoteCard.jsx
        │   ├── NoteForm.jsx          # modal form, create + edit
        │   ├── ProtectedRoute.jsx    # redirects unauthenticated users
        │   └── GuestRoute.jsx        # redirects already-logged-in users away from auth pages
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx         # notes list + CRUD
        ├── App.jsx                   # routes
        ├── main.jsx                  # BrowserRouter + AuthProvider
        └── index.css                 # design tokens + all styles
```

## What was changed in the backend (and why)

The backend logic, routes, controllers, models, and auth flow were **not rewritten**.
Only three things were added, none of which change existing behavior:

1. **`cors` middleware in `src/app.js`** — the API had no CORS handling at all, so the
   browser would have blocked every request from the Vite dev server (a different origin).
   Added `cors({ origin: CLIENT_URL, credentials: true })`.
2. **`GET /api/auth/me` + `getCurrentUser` controller** — needed so the frontend can check
   "is this browser still logged in?" on page load/refresh, using the exact same
   `authMiddleware` every other protected route already uses. Nothing existing was touched.
3. **Register/login responses now omit the password field** from the returned `user` object
   (previously the raw Mongoose document, including the hashed password, was sent back).

Everything else — routes, controllers, models, JWT cookie auth, validation — is untouched.

## Environment variables

**`BackEnd/.env`**
```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
PORT=3000
CLIENT_URL=http://localhost:5173
```

**`Client/client/.env`**
```
VITE_API_URL=http://localhost:3000/api
```

Both `.env` files are already present with working values — MongoDB Atlas is not reachable
from the sandbox this was built in, so the live DB write/read flow couldn't be executed here,
but the code path is a direct, unmodified reuse of your existing controllers/models.

## Install & run

```bash
# Backend
cd BackEnd
npm install
npm run dev          # starts on http://localhost:3000

# Frontend (separate terminal)
cd Client/client
npm install
npm run dev           # starts on http://localhost:5173
```

Open `http://localhost:5173` in the browser.

## Checklist

- [x] **Authentication** — Register, Login, Logout, persisted session (`/api/auth/me` on load),
      protected routes (`ProtectedRoute`), redirect unauthenticated users to `/login`,
      redirect authenticated users away from `/login` and `/register` (`GuestRoute`).
- [x] **Notes CRUD** — Create, list, edit, delete, all scoped to the logged-in user via the
      existing `authMiddleware` + `req.user._id` filtering in `notes.controller.js`.
- [x] **Routing** — `react-router-dom` with `/`, `/login`, `/register`, `/dashboard`, and a
      catch-all redirect.
- [x] **Backend connected** — one centralized axios instance (`src/api/axios.js`) with
      `baseURL`, `withCredentials: true`, and a response interceptor that normalizes every
      error (network failure, validation error, 401, etc.) into `{ message, status }`.
- [x] **No missing files** — every file referenced by imports exists; `npm run build` and
      `npx eslint .` both pass with zero errors.
- [x] **Error handling** — loading states (spinners, disabled buttons with "…" labels),
      invalid credentials (backend message surfaced in the form), network failures
      (friendly message via axios interceptor + a "Try again" retry), empty note list
      (empty state with a CTA), backend validation errors (surfaced inline in forms).
- [x] **Project builds successfully** — verified with `vite build` and `eslint`.

### Not verifiable inside this sandbox
Live registration/login/note-creation against MongoDB Atlas — the sandbox's network
allowlist doesn't include MongoDB's domains. The Express server itself was confirmed to
boot cleanly and wire up all routes/middleware correctly; run it locally (or wherever this
gets deployed) with real network access and it will hit your existing Atlas cluster exactly
as your original controllers already do.
