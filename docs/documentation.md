# Telemedicine Patient Portal - Technical Documentation

## Overview

This is a full-stack telemedicine platform built for a medical engineering student project. It demonstrates how a patient portal works with features like appointment booking, prescriptions, and medical records.

## System Architecture

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (database ORM)
- SQLite (local database)
- JWT for authentication
- ReportLab for PDF generation

**Frontend:**
- React 18 with TypeScript
- Material UI for components
- React Query for data fetching
- Vite as build tool

## Database Schema

The application uses 13 main tables:

**Core Tables:**
- `users` - User accounts (patients and doctors)
- `patients` - Patient profiles
- `doctors` - Doctor profiles with specializations
- `appointments` - Appointment bookings
- `prescriptions` - Prescription records
- `medications` - Medication details
- `medical_reports` - Medical documents
- `lab_results` - Laboratory test results
- `health_tips` - Health information articles
- `faqs` - Frequently asked questions
- `symptom_checks` - Symptom checker history
- `notifications` - User notifications
- `medication_reminders` - Medication schedules

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PATCH /api/auth/me` - Update profile
- `POST /api/auth/change-password` - Change password

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/{id}` - Get appointment details
- `PATCH /api/appointments/{id}/cancel` - Cancel appointment
- `PATCH /api/appointments/{id}/status` - Update status (doctors only)

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription (doctors only)
- `GET /api/prescriptions/{id}` - Get prescription details

### Medical Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Upload report (doctors only)
- `GET /api/reports/{id}` - Get report details
- `GET /api/reports/{id}/download` - Download PDF

### Lab Results
- `GET /api/lab-results` - List lab results
- `POST /api/lab-results` - Create lab result (doctors only)
- `GET /api/lab-results/{id}` - Get result details

### Health Content
- `GET /api/content/health-tips` - Get health tips
- `GET /api/content/faq` - Get FAQs

### Other
- `GET /api/doctors` - Search doctors
- `POST /api/symptom-checker` - Check symptoms
- `GET /api/search` - Global search

## Security

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Role-based access control (patient/doctor)
- Protected API routes require authentication

## Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm run test
```

## Deployment Notes

For production deployment:
1. Replace SQLite with PostgreSQL
2. Set up proper environment variables
3. Enable HTTPS
4. Configure CORS properly
5. Set up proper logging
6. Use a production WSGI server (e.g., Gunicorn)

## Known Limitations

- SQLite is not suitable for production use
- No real-time video/chat features
- German language only
- No email/SMS notifications
- Symptom checker is educational only

## Development Setup

See the main README.md for setup instructions.
