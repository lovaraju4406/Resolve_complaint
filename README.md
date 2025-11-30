# ResolveNow — Complaint Resolution System

A full-stack complaint registration & management system (frontend + backend).

## Project Overview

ResolveNow is a complaint registration and management web app that allows users to register complaints, agents/admins to manage and resolve complaints, and supports real-time chat and file attachments. It includes a React frontend and a Node.js/Express backend (MongoDB for persistence).

---

## Features

* User registration / authentication
* Roles: User, Agent, Admin
* Create, update, track complaint status (Open / In Progress / Resolved)
* Real-time chat between users and agents (Socket.IO)
* File upload support for complaint attachments (images/docs)
* Admin dashboard to manage users & agents, view reports

---

## Tech Stack

* Frontend: React (Create React App or Vite), React Router, Tailwind/CSS
* Backend: Node.js, Express.js, MongoDB (Mongoose)
* Real-time: Socket.IO
* Others: Axios, JWT for auth, Multer for file uploads

---

## Repository Structure

```
ResolveNow/
├─ backend/                 # Node/Express backend
│  ├─ node_modules/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ server.js
│  ├─ package.json
│  └─ .env                   # NOT committed
│
├─ frontend/                # React frontend
│  ├─ node_modules/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ index.js / main.jsx
│  ├─ package.json
│  └─ src/index.css
│
├─ .gitignore
├─ README.md
└─ package.json             # optional root package.json
```

> Notes:
>
> * `node_modules/` and `.env` should be in `.gitignore`.
> * If your frontend uses Vite the entry file may be `src/main.jsx` and the dev command may be `npm run dev`. If you're using CRA the dev command is `npm start`.

---

## Quick Start (commands you requested)

Run these commands from the repository root:

```bash
# open frontend and start dev server
cd frontend
npm start

# in a new terminal: open backend and start server
cd ../backend
npm start
```

> Use `npm run dev` instead of `npm start` if your `package.json` defines `dev` for Vite (check `frontend/package.json` and `backend/package.json`).

---

## Detailed Setup & Run

### Prerequisites

* Node.js (v16+) and npm installed
* MongoDB running locally or a MongoDB URI (Atlas)

### 1. Clone repository

```bash
git clone https://github.com/lovaraju4406/Resolve_complaint.git
cd Resolve_complaint
```

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

Open another terminal:

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables) below).

### 4. Run the app

Start frontend (in terminal 1):

```bash
cd frontend
npm start
# or if Vite:
# npm run dev
```

Start backend (in terminal 2):

```bash
cd backend
npm start
# or if backend uses nodemon:
# npm run dev
```

Open browser:

* Frontend: `http://localhost:3000` (or Vite's port, e.g. `http://localhost:5173`)
* Backend API: `http://localhost:5000` (or whatever port in `.env`)

---

## Environment Variables

Create `backend/.env` (DO NOT commit this file). Example values:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resolvenow
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000    # used for CORS/socket origin
```

Adjust ports and URIs to your setup.

---

## Development Workflow

1. Create a feature branch:

```bash
git checkout -b feat/your-feature
```

2. Implement changes in frontend or backend.

3. Test locally:

* `cd frontend && npm start`
* `cd backend && npm start`

4. Stage, commit and push:

```bash
git add .
git commit -m "feat: add ... "
git push -u origin feat/your-feature
```

5. Open a Pull Request on GitHub and merge after review.

---

## API Overview (high-level)

> This section depends on your actual backend routes. Example endpoints:

* `POST /api/auth/register` — register a user
* `POST /api/auth/login` — login (returns JWT)
* `GET /api/complaints` — list complaints (auth required, role-based)
* `POST /api/complaints` — create a complaint (attach file)
* `GET /api/complaints/:id` — get complaint details
* `PUT /api/complaints/:id` — update complaint status / details
* `POST /api/upload` — upload attachment (Multer)

Add full docs and request/response examples to this section when ready.

---

## Deployment

* Frontend: Vercel / Netlify (connect to repo, set build command `npm run build` and publish folder `dist` or `build`)
* Backend: Render / Heroku / Railway (set build and start commands, add environment variables like `MONGODB_URI`, `JWT_SECRET`)
* Use MongoDB Atlas for a production DB

---

## Screenshots

Add screenshots to `/docs` or `/assets/screenshots/` and reference them here:

```md
![Dashboard](docs/screenshots/dashboard.png)
![Create Complaint](docs/screenshots/create-complaint.png)
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: ..."`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please ensure sensitive files (like `.env`) are never committed.

---

## Removing accidentally committed `node_modules` (if needed)

If you accidentally pushed `node_modules` (you did earlier), remove it from the repository and rewrite history if necessary:

> To remove and commit (non-destructive):

```bash
git rm -r --cached backend/node_modules
git rm -r --cached frontend/node_modules
echo "backend/node_modules/" >> .gitignore
echo "frontend/node_modules/" >> .gitignore
git add .gitignore
git commit -m "chore: remove node_modules and update .gitignore"
git push
```

> To fully purge from history (advanced): use `git filter-repo` or BFG Repo-Cleaner. Ask me if you want exact commands.

---

## License

This project is provided under the **MIT License** — add `LICENSE` file if you want to use MIT.

---

