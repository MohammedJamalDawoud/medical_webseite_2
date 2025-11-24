# Telemedizin Patient Portal

> ⚠️ **IMPORTANT DISCLAIMER** ⚠️  
> This is an **EDUCATIONAL DEMONSTRATION** developed for a medical engineering student project.  
> This system is **NOT certified for real healthcare use** and does **NOT replace professional medical advice**.  
> **DO NOT use this system with real patient data or for actual medical care.**

---

## 📋 Overview

A modern telemedicine patient portal demonstrating realistic patient-doctor interactions including:
- 🏥 Appointment scheduling
- 💊 Prescription and medication management  
- 📄 Medical reports and laboratory results
- 💪 Health tips and fitness guidance
- 🔍 Educational symptom checker (non-diagnostic)

**German UI** with English codebase. Built with modern web technologies for educational purposes.

---

## 🛠 Tech Stack

**Backend:**
- FastAPI (Python 3.11+)
- SQLAlchemy + Alembic
- SQLite (local database)
- JWT Authentication
- ReportLab (PDF generation)

**Frontend:**
- React 18 + TypeScript
- Vite
- Material UI (MUI)
- React Router
- React Query (TanStack Query)

---

## ✨ Features

### Patient Features (German UI)
1. **Termine & Ärzte** - Search doctors, book appointments, view history
2. **Rezepte & Medikamente** - View prescriptions, set medication reminders, track intake
3. **Berichte & Laborergebnisse** - View and download medical reports and lab results as PDF
4. **Lebenserhaltung & Fitness** - Browse health tips (Movement, Nutrition, Prevention)
5. **Telemedizin-Ratgeber** - FAQ and educational symptom checker with clear disclaimers
6. **Benutzerkonto** - Profile management, password change, logout

### Doctor Features
- View and manage appointments
- Create prescriptions with medications
- Upload medical reports and lab results

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/MohammedJamalDawoud/medical_webseite_2.git
cd medical_webseite_2
```

#### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example (SQLite default)
copy .env.example .env
# Mac/Linux: cp .env.example .env

# Create database and seed demo data
python seed_data.py

# Start backend server
uvicorn main:app --reload
```

✅ Backend now running at **http://localhost:8000**  
📚 API Documentation: **http://localhost:8000/docs**

#### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend now running at **http://localhost:5173**

#### 4. Access the Application

Open your browser to **http://localhost:5173**

---

## 🔑 Demo Login Credentials

The seed script creates demo accounts for testing:

**Patient Account:**
- Email: `demo.patient@example.com`
- Password: `password123`

**Doctor Account:**
- Email: `demo.doctor@example.com`
- Password: `password123`

---

## 📁 Project Structure

```
medical_webseite_2/
├── backend/                    # FastAPI backend
│   ├── alembic/               # Database migrations
│   ├── auth/                  # Authentication utilities
│   ├── models/                # SQLAlchemy models (13 models)
│   ├── routers/               # API endpoints (8 routers)
│   ├── schemas/               # Pydantic schemas
│   ├── config.py              # Configuration
│   ├── database.py            # Database connection
│   ├── main.py                # FastAPI app
│   ├── seed_data.py           # Demo data script
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API client (Axios)
│   │   ├── auth/              # Authentication context
│   │   ├── layout/            # Main layout components
│   │   ├── pages/             # Page components (11 pages)
│   │   ├── App.tsx            # Main app with routing
│   │   ├── main.tsx           # Entry point
│   │   └── theme.ts           # Material UI theme
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Vite configuration
├── docs/
│   └── documentation.md       # Technical documentation
└── README.md                  # This file
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🗄️ Database

The application uses **SQLite** for simplicity (file: `backend/app.db`).

### Run Migrations
```bash
cd backend
alembic upgrade head
```

### Reset Database
Delete `backend/app.db` and run `python seed_data.py` again.

---

## 📡 API Endpoints

Full API documentation available at **http://localhost:8000/docs** when backend is running.

**Key Endpoints:**
- `POST /api/auth/register` - Patient registration
- `POST /api/auth/login` - User login
- `GET /api/doctors` - Search doctors
- `GET /api/appointments` - List appointments
- `GET /api/prescriptions` - List prescriptions
- `GET /api/reports` - List medical reports
- `GET /api/reports/{id}/download` - Download report PDF
- `GET /api/lab-results` - List lab results
- `POST /api/symptom-checker` - Symptom analysis (educational)

---

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Patient/Doctor)
- ✅ API route protection
- ⚠️ **Not production-ready** - educational demo only

---

## 🌐 Ports

- **Backend:** `8000` (FastAPI)
- **Frontend:** `5173` (Vite dev server)

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.11+)
- Ensure virtual environment is activated
- Check if port 8000 is available: `netstat -ano | findstr :8000`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

### Database errors
- Delete `app.db` and run `python seed_data.py` again
- Check `.env` file has correct `DATABASE_URL`

### CORS errors in browser
- Ensure backend is running on port 8000
- Check `CORS_ORIGINS` in backend `.env`

---

## 📚 Documentation

Full technical documentation is available in [`docs/documentation.md`](./docs/documentation.md), including:
- System architecture diagrams
- Database schema
- API endpoint specifications
- Implementation details
- Testing approach
- Deployment guide

---

## 🎓 Educational Context

This project was developed as part of a medical engineering course to demonstrate:
- Modern full-stack web development
- Healthcare application architecture
- Telemedicine platform features
- Secure authentication and authorization
- RESTful API design
- React state management

**AI Assistance:** This implementation was developed with the assistance of Google Deepmind's Antigravity AI coding assistant.

---

## ⚖️ Limitations

- Not certified for medical use
- SQLite not suitable for production
- No real-time video/chat implementation
- German language only
- No email/SMS notifications
- Symptom checker is educational only (rule-based, non-diagnostic)

---

## 🤝 For Another Machine Setup

To run this project on a different computer:

1. Ensure prerequisites installed (Python 3.11+, Node.js, Git)
2. Clone the repository
3. Follow **Quick Start** steps above exactly
4. Use demo credentials to test

The project uses SQLite (no external database needed) and includes demo data, making it portable and easy to set up.

---

## 📧 Contact

For questions about this educational project:
- Repository: https://github.com/MohammedJamalDawoud/medical_webseite_2
- Issues: Use GitHub Issues for technical questions

---

## ⚠️ Final Reminder

**This is an educational demonstration.**  
**DO NOT use for real medical purposes.**  
**Always consult qualified healthcare professionals for medical advice.**

---

**Built with ❤️ for educational purposes**
