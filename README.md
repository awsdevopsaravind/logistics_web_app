# 🚚 Logistics Management System

A comprehensive logistics management system for rock transportation businesses in India.

## Tech Stack
- **Frontend:** React + Material-UI
- **Backend:** Node.js (Express) + Prisma ORM
- **Database:** PostgreSQL

## Folder Structure
```
logistics_web_app/
  backend/      # Node.js/Express API
  frontend/     # React + Material-UI
  README.md
```

---

## Getting Started

### Backend Setup
```bash
cd backend
npm install
# Configure your .env for PostgreSQL connection
npx prisma init
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Features
- Daily trip recording with kaata receipt details
- Payment tracking (quarry, transporter, customer, advances)
- Government royalty stock monitoring with alerts
- Dashboard with KPIs and profit/loss
- Excel import/export functionality
- Mobile-responsive design

---

## Environment Variables
- Backend: `.env` for database and JWT secrets
- Frontend: `.env` for API base URL (if needed)

---

## Development
- Uses Nodemon for backend hot-reload
- Uses Vite for fast React development

---

## License
MIT