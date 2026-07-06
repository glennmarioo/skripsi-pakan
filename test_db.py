from sqlalchemy import create_engine
import sys

url = "postgresql://postgres.ifthgijrkbvbplspwwrv:%40Glenmario6404@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
