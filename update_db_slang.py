from database import SessionLocal
from models import ProductDB

db = SessionLocal()
products = db.query(ProductDB).filter(ProductDB.age_category.like('%Starter%')).all()

count = 0
for p in products:
    if "DOC" in p.description and "baru menetas" not in p.description:
        p.description = p.description.replace("anak ayam (DOC)", "anak ayam yang baru menetas/netes (DOC)")
        print(f"Updated: {p.name}")
        count += 1

db.commit()
print(f"Database updated successfully. {count} rows changed.")
db.close()
