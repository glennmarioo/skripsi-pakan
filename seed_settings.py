import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, SettingsDB
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_settings():
    print("Creating tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        existing = db.query(SettingsDB).first()
        if not existing:
            new_setting = SettingsDB(whatsapp_number="6287819281389")
            db.add(new_setting)
            db.commit()
            print("Successfully created default store settings!")
        else:
            print("Settings table already has data.")
    except Exception as e:
        print(f"Error seeding settings: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_settings()
