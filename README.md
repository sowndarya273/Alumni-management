# Online Alumni Management System (React + Node/Express + MySQL)

## Folder structure
alumni-system/
  backend/   Node.js, Express, mysql2, JWT  (config, middleware, routes, schema.sql, seed.js, server.js)
  frontend/  React + Vite  (src: App, Auth, Profile, Directory, Events, Jobs, Admin)

## Setup
1. Install Node.js 18+ and MySQL 8 (with MySQL Workbench).
2. Create tables: run backend/schema.sql in Workbench
   (or: mysql -u root -p < backend/schema.sql).
3. Backend:
     cd backend
     copy .env.example .env     (edit DB_PASSWORD and JWT_SECRET)
     npm install
     npm run seed               (admin: admin@alumni.com / Admin@123)
     npm run dev                (http://localhost:5000)
4. Frontend (new terminal):
     cd frontend
     npm install
     npm run dev                (http://localhost:5173)
5. Log in as admin, or register as alumni/student.

## MongoDB -> MySQL mapping
MongoDB Atlas      -> local MySQL Server
Mongoose models    -> SQL tables + mysql2 queries
Collections        -> users, profiles, events, event_registrations, jobs
ObjectId refs      -> INT primary/foreign keys

## API
POST /api/auth/register, /login ; GET /api/auth/me
GET/PUT /api/profile
GET /api/alumni?search=&year=&department=
GET/POST/PUT/DELETE /api/events ; POST/DELETE /api/events/:id/register
GET/POST/PUT/DELETE /api/jobs
Admin: GET /api/admin/users ; PATCH /users/:id/role, /users/:id/status ; DELETE /users/:id
