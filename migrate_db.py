import pandas as pd
from database import engine, Base, SessionLocal
from models import ProductDB
import math

print("Membuat tabel di database...")
Base.metadata.create_all(bind=engine)

print("Membaca file katalog_pakan.csv...")
try:
    df = pd.read_csv('katalog_pakan.csv')
    
    db = SessionLocal()
    
    print("Memasukkan data ke PostgreSQL...")
    added = 0
    for _, row in df.iterrows():
        # Cek apakah produk sudah ada
        existing = db.query(ProductDB).filter(ProductDB.name == row['name']).first()
        if not existing:
            new_product = ProductDB(
                name=row['name'],
                price=row['price'],
                protein=str(row['protein']) if pd.notna(row['protein']) else "N/A",
                age_category=str(row['age_category']) if pd.notna(row['age_category']) else "",
                description=str(row['description']) if pd.notna(row['description']) else "",
                stock=int(row['stock']) if pd.notna(row['stock']) else 0,
                image_url=str(row.get('image_url', '')) if pd.notna(row.get('image_url')) else ""
            )
            db.add(new_product)
            added += 1
            
    db.commit()
    print(f"Migrasi sukses! {added} produk baru berhasil dimasukkan ke database.")
    db.close()
except Exception as e:
    print(f"Terjadi kesalahan saat migrasi: {e}")
