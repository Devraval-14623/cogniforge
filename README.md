# CogniForge

CogniForge is a React/Vite learning workspace with an Express API, Prisma database, PDF uploads, and optional Gemini-powered study-aid generation.

## What was fixed

- Corrected Linux case-sensitive imports for pages, API helpers, and upload middleware.
- Replaced the hard-coded `localhost` API URL with `VITE_API_URL` and a same-origin `/api` default.
- Added environment templates instead of committing secrets.
- Made the server create its upload directory automatically.
- Added startup checks for the JWT secret and database connection.
- Configured a self-contained SQLite database for local development and smoke testing.
- Made Gemini initialization lazy so the server can start without exposing or hard-coding an API key; AI generation returns a clear configuration error until `GEMINI_API_KEY` is set.

## Run locally

Requirements: Node.js 18+.

```bash
# Terminal 1: API
cd server
cp .env.example .env
# Set JWT_SECRET in .env; add GEMINI_API_KEY to enable AI generation.
npm ci
npx prisma generate
npx prisma db push
npm start

# Terminal 2: frontend
cd client
cp .env.example .env
npm ci
npm run dev
```

The API runs at `http://localhost:5000` and Vite at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the API. The local database is `server/prisma/dev.db`.

## Required configuration

- `DATABASE_URL`: defaults to `file:./dev.db` in the server directory.
- `JWT_SECRET`: required for signup/login; use a long random value.
- `GEMINI_API_KEY`: required only when generating summaries, flashcards, and quizzes. Create one in Google AI Studio and keep it only in the server environment.
- `VITE_API_URL`: optional; leave empty for the Vite proxy, or set it to a separately hosted API URL ending in `/api`.

The current Prisma schema uses SQLite so the project can run without a separate database service. For production, use a managed PostgreSQL database and update `server/prisma/schema.prisma`'s provider and `DATABASE_URL` together before migrating.

## Verification

```bash
cd client && npm run build
cd ../server && npx prisma generate
```
