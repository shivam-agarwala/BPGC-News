# BPGS News

### Secure Full Stack News Platform with RBAC & NLP Powered Personalization

BPGS News is a **secure full stack news platform** built with a modern React frontend and Node.js backend.

The platform implements **Role Based Access Control (RBAC)**, secure authentication, protected APIs, and an **NLP powered content pipeline** for intelligent tagging and personalized news discovery.

---

## Key Features

### Secure Authentication & Authorization

* Complete login flow implementation
* Role Based Access Control (RBAC)
* Protected routes (frontend)
* Secure backend APIs
* Data integrity across frontend backend stack

---

### Post Management System

* Create posts
* Display posts dynamically
* Like / Unlike functionality
* Comment system
* Real time UI updates

---

### Intelligent Content Pipeline

* NLP based auto tagging
* Smart content categorization
* Personalized news recommendations
* ML driven content enhancement

---

## Tech Stack

### Frontend

* React (Create React App)
* React Router
* Context / State Management
* REST API integration

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Secure Middleware

---

## Project Structure

```
BPGS-News/
│
├── frontend (root directory)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── db.js
│   └── package.json
│
└── README.md
```

---

# Installation & Setup

## Step 1 — Download Project

Unzip the project and open terminal in the **root directory**.

---

## Step 2 — Install Frontend Dependencies

In the root directory:

```bash
npm install
```

---

## Step 3 — Install Backend Dependencies

Go to backend folder:

```bash
cd backend
npm install
```

---

## Step 4 — Configure Database

Open:

```
backend/db.js
```

Update the database password:

```js
password: "YOUR_DATABASE_PASSWORD"
```

Important: Replace the existing password (used during development) with your own local DB password.

---

## Step 5 — Start Backend Server

Inside backend folder:

```bash
npm run start
```

Backend should start on:

```
http://localhost:5000
```

(or whichever port configured)

---

## Step 6 — Start Frontend

Open another terminal in root directory:

```bash
npm run start
```

Frontend runs on:

```
http://localhost:3000
```

---

# Database Schema Changes

Two tables need to be altered.

Include your altered schema here (replace with your actual SQL):

```sql
ALTER TABLE users
ADD COLUMN role VARCHAR(50) NOT NULL;

ALTER TABLE posts
ADD COLUMN tags TEXT,
ADD COLUMN likes_count INT DEFAULT 0;
```

(Replace with your real altered schema if different.)

---

# Application Flow

1. User registers / logs in
2. JWT token issued
3. Protected routes validated
4. Role based access enforced
5. Users can:

   * Create posts
   * Like / Unlike
   * Comment
6. NLP module auto tags content
7. Personalized recommendations generated

---

# Security Highlights

* JWT based authentication
* Middleware based route protection
* Role based access restrictions
* Secure API design
* Controlled content visibility
* Backend validation checks

---

# Resume Ready One Line Description

Developed a **secure full stack news platform with Role Based Access Control (RBAC) and an ML powered NLP content pipeline**, implementing authentication, protected routing, intelligent tagging, and personalized news recommendations across a scalable frontend backend architecture.

---

# Available Scripts (Frontend)

In the project root:

```bash
npm start
```

Runs app in development mode.

```bash
npm run build
```

Builds production bundle.

```bash
npm test
```

Runs tests.

---

# Future Improvements

* Real-time notifications
* Admin moderation dashboard
* Search engine with semantic ranking
* Deployment (AWS / Vercel / Docker)
* CI/CD integration

---

# Author

**Shivam Agarwala**
