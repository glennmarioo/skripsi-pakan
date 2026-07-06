import os
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import AdminDB

def seed_admin():
    print("Menciptakan tabel admins di database jika belum ada...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(AdminDB).filter(AdminDB.username == "admin").first()
        if existing_admin:
            print("Akun admin sudah ada di database.")
            return

        print("Memasukkan akun bawaan admin (admin / admin123)...")
        new_admin = AdminDB(username="admin", password="admin123")
        db.add(new_admin)
        db.commit()
        print("Selesai! Akun admin berhasil dimasukkan ke Supabase.")
    except Exception as e:
        print(f"Gagal: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
