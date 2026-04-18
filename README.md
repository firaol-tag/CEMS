# CEMS — Customer Engagement Marketing System

## Overview
A MERN-style marketing automation system built for email and SMS campaigns with MySQL storage, targeting, and queue-based delivery.

## Backend
- Express API
- MySQL connection
- SendGrid email integration
- Africa's Talking SMS integration
- Campaign targeting by all/specific/filtered customers
- Message queue worker for reliable delivery

## Frontend
- React + Vite dashboard
- Pages for customers, campaigns, segments
- SaaS admin UI skeleton

## Getting Started
1. Create database and schema in MySQL.
2. Copy `backend/.env.example` to `backend/.env` and fill values.
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start backend server:
   ```bash
   npm run dev
   ```
5. Install frontend dependencies:
   cd ../frontend
   npm install
   npm run dev
   ```
6. Run the queue worker separately:
   ```bash
   cd backend
   npm run worker
   ```

## Notes
- Use the admin `auth` endpoints to register and log in.
- Campaigns can be created as draft, scheduled, or sent immediately.
- Queue worker processes pending email/SMS jobs and retries failed jobs.
