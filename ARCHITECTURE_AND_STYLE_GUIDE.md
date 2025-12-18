# KanBan Project - Architecture & Coding Style Guide

> **Purpose**: This document serves as a comprehensive reference for replicating the architecture, tech stack, and coding patterns used in this project for future development.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Project Structure](#project-structure)
5. [Coding Conventions](#coding-conventions)
6. [Component Patterns](#component-patterns)
7. [State Management](#state-management)
8. [API & Data Flow](#api--data-flow)
9. [Authentication](#authentication)
10. [Database Design](#database-design)
11. [Deployment Strategy](#deployment-strategy)

---

## Project Overview

**Type**: Full-stack web application (Kanban board management system)  
**Architecture**: Client-Server (SPA Frontend + RESTful Backend)  
**Deployment**: Separated frontend and backend deployments

---

## Tech Stack

### Frontend

| Technology             | Version | Purpose                     |
| ---------------------- | ------- | --------------------------- |
| **React**              | ^19.1.0 | UI framework                |
| **Vite**               | ^7.0.4  | Build tool & dev server     |
| **React Router DOM**   | ^7.6.3  | Client-side routing         |
| **Axios**              | ^1.10.0 | HTTP client                 |
| **Firebase**           | ^12.6.0 | Client-side authentication  |
| **@dnd-kit/core**      | ^6.3.1  | Drag-and-drop functionality |
| **@dnd-kit/sortable**  | ^10.0.0 | Sortable drag-and-drop      |
| **@dnd-kit/utilities** | ^3.2.2  | DnD utilities               |

### Backend

| Technology         | Version | Purpose                         |
| ------------------ | ------- | ------------------------------- |
| **Node.js**        | -       | Runtime environment             |
| **Express**        | ^5.1.0  | Web framework                   |
| **PostgreSQL**     | -       | Primary database                |
| **pg**             | ^8.16.3 | PostgreSQL client               |
| **Firebase Admin** | ^13.6.0 | Server-side auth verification   |
| **CORS**           | ^2.8.5  | Cross-origin resource sharing   |
| **dotenv**         | ^17.2.0 | Environment variable management |
| **nodemon**        | ^3.1.11 | Development hot-reloading       |

### Development Tools

- **ESLint** ^9.30.1 - Linting
- **@vitejs/plugin-react-swc** ^3.10.2 - Fast React refresh with SWC compiler
- **ES Modules** (type: "module") - Modern JavaScript modules

---

## Architecture Patterns

### 1. **Separation of Concerns**

- **Frontend**: Client-side rendering, UI logic, authentication state
- **Backend**: Business logic, database operations, authentication verification
- Clear API boundaries between frontend and backend

### 2. **Module System**

- **ES Modules** throughout both frontend and backend
- Use `import/export` syntax exclusively
- `type: "module"` in all package.json files

### 3. **Environment-Based Configuration**

- Use `.env` files for environment variables
- Frontend: `VITE_` prefix for all environment variables (e.g., `VITE_API_URL`)
- Backend: Standard environment variables (no prefix required)
- Support for both local development and production deployment

### 4. **Authentication Architecture**

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Client    │ ──────> │   Firebase   │ <────── │  Backend   │
│  (React)    │ <────── │     Auth     │ ──────> │  (Express) │
└─────────────┘         └──────────────┘         └────────────┘
      │                                                  │
      │                                                  │
      └──────────── Bearer Token in Headers ────────────┘
```

- **Client**: Firebase SDK for login/signup
- **Server**: Firebase Admin SDK for token verification
- Token passed in `Authorization: Bearer <token>` header
- Middleware-based authentication on protected routes

### 5. **Database Access Pattern**

- PostgreSQL connection pooling
- Parameterized queries to prevent SQL injection
- User ownership verification on all operations
- Cascading deletes defined at database schema level

---

## Project Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Router configuration
│   ├── components/           # Reusable UI components
│   │   ├── Board/            # Board component (column)
│   │   ├── Card/             # Card component
│   │   ├── Column/           # Column wrapper
│   │   ├── Layout/           # Layout wrapper with navbar
│   │   └── NavBar/           # Navigation bar
│   ├── pages/                # Route-level components
│   │   ├── Boards.jsx        # Board view page
│   │   ├── Projects.jsx      # Projects list page
│   │   ├── Login.jsx         # Login page
│   │   └── CreateAccount.jsx # Registration page
│   ├── contexts/             # React Context providers
│   │   └── BoardContext.jsx  # Board state management
│   ├── firebase/             # Firebase configuration
│   │   └── config.js         # Firebase initialization
│   ├── utils/                # Utility functions
│   │   ├── api.js            # Axios instance configuration
│   │   └── waitForAuth.js    # Auth state helper
│   ├── assets/               # Static assets
│   └── hooks/                # Custom hooks
│       └── useUser.js        # User authentication hook
├── public/                   # Static public files
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies and scripts
```

### Backend Structure

```
backend/
├── src/
│   ├── server.js             # Express server & API routes
│   └── db.js                 # Database connection pool
├── schema.sql                # Database schema
├── credentials.json          # Firebase service account (local only)
├── .env                      # Environment variables
└── package.json              # Dependencies and scripts
```

---

## Coding Conventions

### General Principles

1. **ES Modules**: Always use `import/export`
2. **Consistent Naming**:
   - **Components**: PascalCase (e.g., `Board.jsx`, `NavBar.jsx`)
   - **Files**: camelCase for utilities (e.g., `api.js`, `waitForAuth.js`)
   - **Variables**: camelCase (e.g., `userId`, `projectInfo`)
   - **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
3. **File Organization**: Group by feature, not by type
4. **Imports Order**:

   ```javascript
   // 1. External libraries
   import React from "react";
   import axios from "axios";

   // 2. Internal utilities/configs
   import { auth } from "./firebase/config.js";

   // 3. Components
   import Board from "./components/Board/Board";

   // 4. Styles
   import "./App.css";
   ```

### JavaScript Style

```javascript
// ✅ DO: Use arrow functions for components
export const Board = ({ id, title, cards = [] }) => {
  // Component logic
};

// ✅ DO: Destructure props in function signature
export const Card = ({ card, columnId }) => {
  // Use card.title, card.id directly
};

// ✅ DO: Use async/await for asynchronous operations
const handleCreateProject = async () => {
  try {
    const token = await user.getIdToken();
    const res = await axios.post("/api/newProject", { title });
  } catch (error) {
    console.error("Error:", error);
  }
};

// ✅ DO: Use optional chaining and nullish coalescing
const title = req.body?.title ?? "";
const token = req.headers.authorization?.split("Bearer ")[1];

// ✅ DO: Validate input early
if (!title.trim()) {
  return res.status(400).json({ error: "title is required" });
}
```

### CSS Organization

- **Component-level CSS**: Each component has its own CSS file
- **Naming**: Use kebab-case for CSS classes (e.g., `.kanban-column`, `.add-task-btn`)
- **BEM-inspired**: Use descriptive class names that indicate purpose

---

## Component Patterns

### 1. **Page Components** (Route-level)

```javascript
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useUser from "../useUser";

export default function Projects() {
  const initialData = useLoaderData();        // Data from loader
  const navigate = useNavigate();             // Navigation
  const [state, setState] = useState(initialData);
  const { user, isLoading } = useUser();      // Auth state

  // Effects for data fetching
  useEffect(() => {
    // Fetch data when user changes
  }, [user, isLoading]);

  return (
    // JSX
  );
}
```

### 2. **Reusable Components**

```javascript
import { useState } from "react";
import "./Component.css";

export const Component = ({ prop1, prop2 }) => {
  const [localState, setLocalState] = useState(null);

  return <div className="component-wrapper">{/* JSX */}</div>;
};
```

### 3. **Drag-and-Drop Components**

```javascript
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Card = ({ card, columnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${card.id}`,
    data: { type: "task", taskId: card.id, columnId },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Content */}
    </div>
  );
};
```

---

## State Management

### 1. **React Context Pattern**

```javascript
// Context definition
import { createContext, useContext } from "react";

const BoardContext = createContext(null);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within BoardProvider");
  }
  return context;
};

export default BoardContext;
```

### 2. **Custom Hooks**

```javascript
// useUser.js - Authentication hook
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, function (user) {
      setUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { isLoading, user, userName: user?.displayName || "" };
};

export default useUser;
```

### 3. **State Update Patterns**

```javascript
// Immutable state updates with spreading
setBoards((prevBoards) =>
  prevBoards.map((board) =>
    board.id === id ? { ...board, items: [...board.items, newItem] } : board
  )
);

// Filtering
setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
```

---

## API & Data Flow

### 1. **Axios Configuration**

```javascript
// frontend/src/utils/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s for slow cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - check backend at:", API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. **API Request Pattern**

```javascript
// Always include auth token
const token = await user.getIdToken();

// Making requests
const response = await axios.get("/api/endpoint", {
  headers: { Authorization: `Bearer ${token}` },
});

// POST with data
await axios.post(
  "/api/endpoint",
  { data },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### 3. **React Router Loaders**

```javascript
{
  path: "/boards/:id",
  element: <Layout><Boards /></Layout>,
  loader: async ({ params }) => {
    const user = await waitForAuth();
    if (!user) return redirect("/login");

    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/boards/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return redirect("/login");
      }
      return [];
    }
  },
}
```

---

## Authentication

### Frontend Authentication Flow

```javascript
// 1. Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 2. Auth state listener
const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return { user };
};

// 3. Wait for auth helper
export const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
```

### Backend Authentication Middleware

```javascript
// Firebase Admin initialization
import admin from "firebase-admin";
import fs from "fs";

// Support both environment variable and file
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else if (fs.existsSync("./credentials.json")) {
  serviceAccount = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user to request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Usage
app.get("/api/projects", authenticate, async (req, res) => {
  const uid = req.user.uid; // Access authenticated user
  // ... handle request
});
```

---

## Database Design

### Schema Pattern

```sql
-- User-owned hierarchical structure
users (id, email, display_name)
  └── projects (id, title, owner_id → users.id)
      └── boards (id, title, project_id → projects.id)
          └── elements (id, title, subtitle, board_id → boards.id, position)

-- Cascading deletes at schema level
ON DELETE CASCADE
```

### Database Connection Pattern

```javascript
import pkg from "pg";
const { Pool } = pkg;

let pool;

// Support both connection string and individual vars
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

export default pool;
```

### Query Patterns

```javascript
// 1. Parameterized queries (ALWAYS)
const { rows } = await pool.query(
  "SELECT * FROM projects WHERE owner_id = $1",
  [uid]
);

// 2. Ownership verification
const { rows } = await pool.query(
  "SELECT EXISTS (SELECT 1 FROM projects WHERE id=$1 AND owner_id=$2)",
  [projectId, uid]
);

if (!rows[0].exists) {
  return res.status(403).json({ error: "Unauthorized" });
}

// 3. RETURNING clause for inserts
const { rows } = await pool.query(
  "INSERT INTO projects (title, owner_id) VALUES ($1, $2) RETURNING *",
  [title, uid]
);
return res.status(201).json(rows[0]);

// 4. Error handling
try {
  // ... query
} catch (err) {
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({ error: "Already exists" });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
```

---

## Backend API Patterns

### Express Server Structure

```javascript
import express from "express";
import cors from "cors";

const app = express();

// 1. CORS configuration
const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// 2. Middleware
app.use(express.json());

// 3. Health checks
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// 4. Protected routes with middleware
app.get("/api/projects", authenticate, async (req, res) => {
  const uid = req.user.uid;
  // ... implementation
});

// 5. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### REST API Conventions

- **GET** `/api/resource` - List resources
- **GET** `/api/resource/:id` - Get specific resource
- **POST** `/api/newResource` - Create resource
- **DELETE** `/api/deleteResource/:id` - Delete resource
- **PATCH** `/api/editResource/:id` - Update resource

### Response Patterns

```javascript
// Success with data
res.json(data);
res.status(201).json(createdData);

// Success no content
res.sendStatus(204);

// Client errors
res.status(400).json({ error: "Bad request message" });
res.status(401).json({ error: "Unauthorized message" });
res.status(403).json({ error: "Forbidden message" });
res.status(404).json({ error: "Not found message" });
res.status(409).json({ error: "Conflict message" });

// Server errors
res.status(500).json({ error: "Internal server error" });
```

---

## Deployment Strategy

### Environment Variables

#### Frontend (.env)

```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

#### Backend (.env)

```bash
# Database (use one approach)
DATABASE_URL=postgresql://user:pass@host:port/dbname  # Production
# OR individual vars for local dev
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=kanban
DB_PASSWORD=password
DB_PORT=5432

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  # Production
# OR use credentials.json file for local dev

# Server
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Build Configuration

#### Frontend (Vite)

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // Dev only
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    target: "esnext",
  },
});
```

#### Backend Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

### Deployment Checklist

1. ✅ Set all environment variables on hosting platform
2. ✅ Configure CORS to allow production frontend URL
3. ✅ Run database schema on production database
4. ✅ Test health endpoints (`/health`)
5. ✅ Verify Firebase credentials (service account)
6. ✅ Configure proper timeouts (30s for cold starts)
7. ✅ Monitor logs for CORS and auth errors

---

## Key Design Decisions

### 1. **Why ES Modules?**

- Modern JavaScript standard
- Better tree-shaking in production builds
- Native browser support
- Cleaner import syntax

### 2. **Why Vite over Create React App?**

- Significantly faster dev server (ESBuild)
- Faster production builds
- Better HMR (Hot Module Replacement)
- Modern tooling with better defaults

### 3. **Why Firebase Authentication?**

- Simplified user management
- Built-in security features
- Easy integration with frontend and backend
- Handles token refresh automatically

### 4. **Why PostgreSQL?**

- ACID compliance for data integrity
- Relational structure fits hierarchical data
- Strong support for foreign keys and cascading
- Excellent performance for read-heavy workloads

### 5. **Why Separate Frontend/Backend?**

- Independent scaling
- Different deployment platforms (Vercel + Render)
- Clear separation of concerns
- Easier to maintain and test

### 6. **Why @dnd-kit over react-beautiful-dnd?**

- Better performance
- More flexible and modular
- Better TypeScript support
- Active maintenance

---

## Quick Start Template

Use this checklist when starting a new project with this architecture:

### Initial Setup

```bash
# 1. Create project folders
mkdir my-project && cd my-project
mkdir frontend backend

# 2. Initialize frontend
cd frontend
npm create vite@latest . -- --template react-swc
npm install axios firebase react-router-dom @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# 3. Initialize backend
cd ../backend
npm init -y
npm install express cors dotenv pg firebase-admin
npm install -D nodemon

# 4. Update package.json files
# Add "type": "module" to both package.json files

# 5. Create folder structures (see Project Structure section)

# 6. Copy configuration files
# - vite.config.js
# - .env.example files
# - Firebase config templates
# - Database schema
```

### Development Workflow

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Database (if local)
# Run PostgreSQL locally or connect to cloud instance
```

---

## Summary of Core Principles

1. **Modular Architecture**: Clear separation between frontend, backend, and database
2. **Security First**: Token-based authentication, parameterized queries, user ownership verification
3. **Modern Tooling**: ES Modules, Vite, React 19, Express 5
4. **Environment Flexibility**: Support both local development and production deployment
5. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
6. **Code Organization**: Component-based structure, custom hooks, context for state
7. **Database Integrity**: Foreign keys, cascading deletes, indexes for performance
8. **API Design**: RESTful conventions, consistent response patterns, middleware-based auth
9. **Developer Experience**: Hot reloading, clear console logging, detailed error messages
10. **Production Ready**: Health checks, CORS configuration, timeout handling

---

**Last Updated**: December 17, 2025  
**Version**: 1.0  
**Project**: KanBan Board Application
