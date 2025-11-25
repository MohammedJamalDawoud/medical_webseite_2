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

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MohammedJamalDawoud/medical_webseite_2.git
cd medical_webseite_2
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python seed_data.py
python -m uvicorn main:app --reload
```

The backend will run at http://localhost:8000

3. Set up the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at http://localhost:5173

### Demo Accounts

**Patient:**
- Email: demo.patient@example.com
- Password: password123

**Doctor:**
- Email: demo.doctor@example.com
- Password: password123

## Project Structure

```
medical_webseite_2/
├── backend/          # FastAPI server
├── frontend/         # React application
└── docs/            # Documentation
```

## Features

- User authentication (JWT)
- Appointment scheduling
- Prescription management
- Medical reports with PDF download
- Lab results viewing
- Health tips library
- FAQ section
- Symptom checker

## API Documentation

When the backend is running, visit http://localhost:8000/docs for the interactive API documentation.

## Notes

This is a student project for educational purposes. The German UI demonstrates a realistic telemedicine interface.
