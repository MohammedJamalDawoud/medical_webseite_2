# Telemedicine Patient Portal

A web-based telemedicine platform for managing patient-doctor interactions, appointments, prescriptions, and medical records.

## What it does

This is a full-stack application that allows patients to:
- Book appointments with doctors
- View and manage prescriptions
- Access medical reports and lab results
- Get health tips and check symptoms

Doctors can manage appointments, create prescriptions, and upload medical documents.

## Tech Stack

**Backend:** Python, FastAPI, SQLAlchemy, SQLite  
**Frontend:** React, TypeScript, Material UI, Vite

## Quick Start (Recommended)

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher

### Automated Setup (Easiest)

Run the automated setup script that handles everything:

```powershell
.\setup.ps1
```

This script will:
- Create `.env` file in backend
- Set up Python virtual environment
- Install all dependencies
- Create and seed the database with demo data

Then start the servers as instructed by the script.

---

## Manual Setup (Alternative)

If you prefer to set up manually or the automated script doesn't work:

### 1. Clone the repository
```bash
git clone https://github.com/MohammedJamalDawoud/medical_webseite_2.git
cd medical_webseite_2
```

### 2. Backend Setup

```bash
cd backend

# Create .env file (IMPORTANT!)
copy .env.example .env

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# OR
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create database and demo data (IMPORTANT!)
python seed_data.py

# Start backend server
python -m uvicorn main:app --reload
```

✅ Backend will run at **http://localhost:8000**

### 3. Frontend Setup (in a NEW terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

✅ Frontend will run at **http://localhost:5173**

---

## Demo Accounts

After running `seed_data.py`, you can login with:

**Patient:**
- Email: `demo.patient@example.com`
- Password: `password123`

**Doctor:**
- Email: `demo.doctor@example.com`
- Password: `password123`

---

## Troubleshooting

### Login fails with "Login fehlgeschlagen"

This usually means the database wasn't seeded. Fix it by:

```bash
cd backend
.\venv\Scripts\Activate.ps1  # Activate virtual environment
python seed_data.py           # Re-run seed script
```

### Backend not starting

Make sure `.env` file exists in the `backend` folder:

```bash
cd backend
copy .env.example .env
```

### Frontend can't connect to backend

1. Make sure backend is running on http://localhost:8000
2. Check that Vite dev server shows the proxy configuration
3. Restart the frontend: `npm run dev`

---

## Project Structure

```
medical_webseite_2/
├── backend/          # FastAPI server
│   ├── auth/         # Authentication logic
│   ├── models/       # Database models
│   ├── routers/      # API endpoints
│   ├── seed_data.py  # Database seeder
│   └── .env.example  # Environment template
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   └── api/      # API client
│   └── vite.config.ts
└── setup.ps1         # Automated setup script
```

## Features

- User authentication (JWT)
- Appointment scheduling
- Prescription management
- Medical reports with PDF download
- Lab results with trend visualization
- Health tips library
- FAQ section
- Symptom checker

## API Documentation

When the backend is running, visit **http://localhost:8000/docs** for the interactive API documentation (Swagger UI).

## Notes

This is a student project for educational purposes. The German UI demonstrates a realistic telemedicine interface.
