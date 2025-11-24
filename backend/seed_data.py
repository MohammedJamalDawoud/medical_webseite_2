"""Seed script to populate database with demo data."""
import sys
from datetime import datetime, date, time, timedelta
from database import SessionLocal, Base, engine
from models.user import User, UserRole
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment, AppointmentType, AppointmentStatus
from models.prescription import Prescription
from models.medication import Medication
from models.report import Report
from models.lab_result import LabResult
from models.health_tip import HealthTip, HealthTipCategory
from models.faq import FAQ
from auth.utils import hash_password

def seed_database():
    """Seed the database with demo data."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database...")
        
        # Create demo patient user
        patient_user = User(
            email="demo.patient@example.com",
            password_hash=hash_password("password123"),
            name="Max Mustermann",
            phone="+49 30 12345678",
            date_of_birth=datetime(1985, 5, 15),
            role=UserRole.PATIENT
        )
        db.add(patient_user)
        db.flush()
        
        patient = Patient(user_id=patient_user.id, medical_notes="Demo patient account")
        db.add(patient)
        db.flush()
        print(f"✅ Created demo patient: {patient_user.email}")
        
        # Create demo doctor users
        doctors_data = [
            {
                "email": "demo.doctor@example.com",
                "name": "Dr. med. Anna Schmidt",
                "specialization": "Allgemeinmedizin",
                "city": "Berlin",
                "clinic_address": "Hauptstraße 123, 10115 Berlin",
                "description": "Fachärztin für Allgemeinmedizin mit 15 Jahren Erfahrung",
                "availability": "Mo-Fr 9-17 Uhr"
            },
            {
                "email": "dr.mueller@example.com",
                "name": "Dr. Thomas Müller",
                "specialization": "Kardiologie",
                "city": "München",
                "clinic_address": "Herzstraße 45, 80331 München",
                "description": "Spezialist für Herz-Kreislauf-Erkrankungen",
                "availability": "Mo-Do 10-18 Uhr"
            },
            {
                "email": "dr.weber@example.com",
                "name": "Dr. Sarah Weber",
                "specialization": "Dermatologie",
                "city": "Hamburg",
                "clinic_address": "Hautweg 7, 20095 Hamburg",
                "description": "Hautärztin mit Schwerpunkt Allergologie",
                "availability": "Di-Fr 8-16 Uhr"
            }
        ]
        
        doctor_objects = []
        for doctor_data in doctors_data:
            doctor_user = User(
                email=doctor_data["email"],
                password_hash=hash_password("password123"),
                name=doctor_data["name"],
                phone="+49 89 98765432",
                role=UserRole.DOCTOR
            )
            db.add(doctor_user)
            db.flush()
            
            doctor = Doctor(
                user_id=doctor_user.id,
                specialization=doctor_data["specialization"],
                city=doctor_data["city"],
                clinic_address=doctor_data["clinic_address"],
                description=doctor_data["description"],
                availability_notes=doctor_data["availability"]
            )
            db.add(doctor)
            db.flush()
            doctor_objects.append(doctor)
            print(f"✅ Created doctor: {doctor_user.name} - {doctor.specialization}")
        
        # Create sample appointments
        appointments_data = [
            {
                "doctor": doctor_objects[0],
                "date": date.today() + timedelta(days=3),
                "time": time(10, 0),
                "type": AppointmentType.VIDEO,
                "status": AppointmentStatus.CONFIRMED
            },
            {
                "doctor": doctor_objects[1],
                "date": date.today() - timedelta(days=7),
                "time": time(14, 30),
                "type": AppointmentType.CHAT,
                "status": AppointmentStatus.COMPLETED
            }
        ]
        
        for apt_data in appointments_data:
            appointment = Appointment(
                patient_id=patient.id,
                doctor_id=apt_data["doctor"].id,
                date=apt_data["date"],
                time=apt_data["time"],
                type=apt_data["type"],
                status=apt_data["status"]
            )
            db.add(appointment)
        print(f"✅ Created {len(appointments_data)} appointments")
        
        # Create sample prescription with medications
        prescription = Prescription(
            patient_id=patient.id,
            doctor_id=doctor_objects[0].id,
            description="Behandlung bei Bluthochdruck"
        )
        db.add(prescription)
        db.flush()
        
        medications = [
            {
                "name": "Ramipril 5mg",
                "dosage": "1 Tablette",
                "frequency": "1x täglich morgens",
                "start_date": date.today() - timedelta(days=30),
                "notes": "Mit Wasser einnehmen"
            },
            {
                "name": "ASS 100mg",
                "dosage": "1 Tablette",
                "frequency": "1x täglich abends",
                "start_date": date.today() - timedelta(days=30),
                "notes": "Nach dem Essen"
            }
        ]
        
        for med_data in medications:
            medication = Medication(
                prescription_id=prescription.id,
                **med_data
            )
            db.add(medication)
        print(f"✅ Created prescription with {len(medications)} medications")
        
        # Create sample report
        report = Report(
            patient_id=patient.id,
            doctor_id=doctor_objects[0].id,
            title="Routineuntersuchung vom 15.11.2024",
            content="""Sehr geehrter Patient,\n\nIhre Routineuntersuchung ergab folgende Befunde:\n\n- Blutdruck: 130/85 mmHg (leicht erhöht)\n- Herzfrequenz: 72 bpm (normal)\n- Gewicht: 78 kg\n\nEmpfehlung: Fortsetzung der aktuellen Medikation. Kontrolle in 3 Monaten.\n\nMit freundlichen Grüßen,\nDr. Anna Schmidt"""
        )
        db.add(report)
        print("✅ Created medical report")
        
        # Create sample lab results
        lab_results_data = [
            {
                "test_name": "Blutzucker (nüchtern)",
                "result_value": "95",
                "unit": "mg/dL",
                "normal_range": "70-100 mg/dL",
                "date": date.today() - timedelta(days=5)
            },
            {
                "test_name": "Gesamtcholesterin",
                "result_value": "185",
                "unit": "mg/dL",
                "normal_range": "<200 mg/dL",
                "date": date.today() - timedelta(days=5)
            },
            {
                "test_name": "HbA1c",
                "result_value": "5.4",
                "unit": "%",
                "normal_range": "4.0-5.6%",
                "date": date.today() - timedelta(days=5)
            }
        ]
        
        for lab_data in lab_results_data:
            lab_result = LabResult(
                patient_id=patient.id,
                doctor_id=doctor_objects[0].id,
                **lab_data
            )
            db.add(lab_result)
        print(f"✅ Created {len(lab_results_data)} lab results")
        
        # Create health tips
        health_tips = [
            {
                "title": "Regelmäßige Bewegung",
                "content": "30 Minuten moderate Bewegung pro Tag können das Risiko für Herz-Kreislauf-Erkrankungen deutlich senken. Schon ein Spaziergang zählt!",
                "category": HealthTipCategory.BEWEGUNG
            },
            {
                "title": "Ausgewogene Ernährung",
                "content": "Eine mediterrane Ernährung mit viel Obst, Gemüse, Fisch und Olivenöl unterstützt die Herzgesundheit und das allgemeine Wohlbefinden.",
                "category": HealthTipCategory.ERNAEHRUNG
            },
            {
                "title": "Regelmäßige Vorsorgeuntersuchungen",
                "content": "Nehmen Sie regelmäßig an Vorsorgeuntersuchungen teil. Früherkennung kann Leben retten!",
                "category": HealthTipCategory.PRAEVENTION
            },
            {
                "title": "Wann zur Telemedizin greifen?",
                "content": "Telemedizin eignet sich besonders für Nachkontrollen, leichte Beschwerden und Beratungsgespräche. Bei akuten Notfällen wählen Sie immer den Notruf 112!",
                "category": HealthTipCategory.GESUNDHEIT
            }
        ]
        
        for tip_data in health_tips:
            tip = HealthTip(**tip_data)
            db.add(tip)
        print(f"✅ Created {len(health_tips)} health tips")
        
        # Create FAQs
        faqs = [
            {
                "question": "Was ist Telemedizin?",
                "answer": "Telemedizin ermöglicht medizinische Beratung und Behandlung über digitale Kommunikationsmittel wie Video, Chat oder Telefon."
            },
            {
                "question": "Wie buche ich einen Termin?",
                "answer": "Wählen Sie unter 'Arzt finden' einen passenden Arzt aus, wählen Sie Datum und Uhrzeit und bestätigen Sie die Buchung."
            },
            {
                "question": "Kann ich meinen Termin absagen?",
                "answer": "Ja, Sie können Termine bis zu 24 Stunden vor dem Termin kostenlos stornieren."
            },
            {
                "question": "Sind Video-Konsultationen sicher?",
                "answer": "Ja, alle Kommunikation ist verschlüsselt und entspricht den Datenschutzbestimmungen (DSGVO)."
            },
            {
                "question": "Wann sollte ich den Notruf wählen?",
                "answer": "Bei lebensbedrohlichen Situationen (starke Brustschmerzen, Atemnot, Bewusstlosigkeit) rufen Sie sofort die 112!"
            }
        ]
        
        for faq_data in faqs:
            faq = FAQ(**faq_data)
            db.add(faq)
        print(f"✅ Created {len(faqs)} FAQs")
        
        db.commit()
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Demo Login Credentials:")
        print("   Patient: demo.patient@example.com / password123")
        print("   Doctor:  demo.doctor@example.com / password123")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
