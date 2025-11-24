#!/usr/bin/env python3
"""Database verification script for Telemedizin project."""
import sqlite3
import sys

def check_database():
    """Check database tables and sample data."""
    try:
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(f"[OK] Database exists with {len(tables)} tables:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count} records")
        
        # Check for required tables
        required_tables = ['users', 'patients', 'doctors', 'appointments', 
                          'prescriptions', 'medications', 'reports', 'lab_results']
        table_names = [t[0] for t in tables]
        
        missing = [t for t in required_tables if t not in table_names]
        if missing:
            print(f"\n[WARN] Missing tables: {', '.join(missing)}")
            print("Run: python seed_data.py to initialize database")
            return False
        
        print("\n[OK] All required tables present")
        
        # Check for demo data
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        if user_count < 2:
            print(f"\n[WARN] Only {user_count} users found")
            print("Run: python seed_data.py to add demo data")
            return False
        
        print(f"[OK] Database has demo data ({user_count} users)")
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"[ERROR] Database error: {e}")
        return False
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        return False

if __name__ == "__main__":
    success = check_database()
    sys.exit(0 if success else 1)
