# CogniForge

CogniForge is a React/Vite learning workspace with an Express API, Prisma/PostgreSQL persistence, PDF text extraction, and Gemini-powered study-aid generation. For each uploaded PDF, the backend extracts the actual text and asks Gemini for a concise summary, 8 topic-wise important flashcards, and exactly 10 important multiple-choice questions grounded in that document.

## Architecture

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Multer, `pdf-parse`, JWT authentication
- **Database:** PostgreSQL through Prisma
- **AI:** Gemini called only from the backend
- **Persistence:** summaries, topic-wise flashcards, and quizzes are stored with the owning material and user

## GitHub Pages deployment

The GitHub Pages workflow builds `client/`. GitHub Pages can serve the frontend only; it cannot run Express, PostgreSQL, PDF extraction, authentication, or Gemini. The Pages frontend must be built with `VITE_API_URL` pointing to a deployed backend URL ending in `/api`.

If the backend is not configured, the frontend shows the real API error. It never substitutes sample, mock, or browser-local study content.

### Deploy the backend

GitHub Pages cannot run the Express API. This repository includes `render.yaml` for deploying the `server/` directory as a Render web service. Connect the repository in Render, keep the existing PostgreSQL `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY` values, and set `FRONTEND_URL` to `https://devraval-14623.github.io`. After deployment, set the Pages build variable `VITE_API_URL` to the new backend URL ending in `/api`.

Verify CORS before testing the website:

```bash
curl -i -X OPTIONS https://YOUR_BACKEND_HOST/api/auth/signup \
  -H 'Origin: https://devraval-14623.github.io' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

The response must include `Access-Control-Allow-Origin: https://devraval-14623.github.io` and must not return the GitHub Pages HTML.

## Run the backend

```bash
cd server
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, and FRONTEND_URL in .env.
npm ci
npm run db:setup
npm start
```

The server creates `uploads/` automatically and exposes `GET /health`. `npm run db:setup` generates Prisma Client and synchronizes the PostgreSQL schema.

## Run the frontend

```bash
cd client
cp .env.example .env
# Set VITE_API_URL to the backend URL ending in /api when the backend is hosted separately.
npm ci
npm run dev
```

The Vite development proxy sends `/api` requests to `http://localhost:5000` when `VITE_API_URL` is empty.

## Real study-aid flow

1. The authenticated user uploads a PDF to `POST /api/materials/upload`.
2. The backend extracts the PDF text and rejects empty extraction.
3. `POST /api/ai/generate/:materialId` loads the user-owned material and sends its extracted text to Gemini.
4. The response is validated as one summary, 8 topic-wise flashcards with importance notes, and 10 MCQs with four options each.
5. Prisma saves the summary, flashcards, and quizzes in one transaction.
6. `GET /api/materials/:materialId/study-aids` retrieves the saved data after refresh.
7. The dashboard renders the API response; it does not contain hardcoded study content.

## Required configuration

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: long random backend secret for signup/login tokens.
- `GEMINI_API_KEY`: backend-only Gemini key for real generation.
- `FRONTEND_URL`: exact frontend origin for CORS, such as `https://devraval-14623.github.io`.
- `VITE_API_URL`: public backend URL ending in `/api`.

Never place `DATABASE_URL`, `JWT_SECRET`, or `GEMINI_API_KEY` in frontend code or GitHub Pages artifacts.

## Verification

```bash
cd client && npm run lint && npm run build
cd ../server && node --check index.js && npx prisma generate
```
