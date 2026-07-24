import logging
import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, status
import secrets
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import ProductDB
from sqlalchemy.orm import Session
from rag_engine import RAGEngine
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Console output
        logging.FileHandler('app.log')  # File output
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

logger.info("Initializing FastAPI application...")
logger.info("Loading environment variables from .env file")

app = FastAPI(
    title="PT. Cipta Sama Abadi - Poultry Feed E-Commerce API",
    description="AI-powered poultry feed recommendation and ordering system",
    version="1.0.0"
)

# Auto-create database tables (including Orders) if they don't exist
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
logger.info("Database tables verified/created")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    expected_token = os.getenv("ADMIN_TOKEN", "demo_admin_token_123")
    if not secrets.compare_digest(credentials.credentials, expected_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True

class LoginRequest(BaseModel):
    username: str
    password: str

class QueryRequest(BaseModel):
    query: str
    history: List[str] = []

class RecommendedProduct(BaseModel):
    name: str
    price: int
    stock: int

class QueryResponse(BaseModel):
    message: str
    recommended_products: List[RecommendedProduct]

class CustomerData(BaseModel):
    nama: str
    email: str
    phone: str
    alamat: str

class CartItem(BaseModel):
    product: dict  # Simplified for this demo
    quantity: int

class ProductCreate(BaseModel):
    name: str
    price: str
    protein: str
    age_category: str
    description: str
    stock: int
    image_url: Optional[str] = ""

class ProductUpdate(BaseModel):
    name: str
    price: str
    protein: str
    age_category: str
    description: str
    stock: int
    image_url: Optional[str] = ""

class CheckoutRequest(BaseModel):
    customer: CustomerData
    items: List[CartItem]
    total: int

class CheckoutResponse(BaseModel):
    success: bool
    message: str
    resi_number: str

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    items: str
    total_price: int

class OrderResponse(OrderCreate):
    id: int
    status: str
    created_at: str

def send_order_email(customer: CustomerData, items: List[CartItem], total: int, resi_number: str):
    """Send order confirmation email to customer"""
    print(f"DEBUG: Starting email send to {customer.email}")

    smtp_email = os.getenv('SMTP_EMAIL')
    smtp_password = os.getenv('SMTP_PASSWORD')

    print(f"DEBUG: SMTP email loaded: {bool(smtp_email)}")
    print(f"DEBUG: SMTP password loaded: {bool(smtp_password)}")

    if not smtp_email or not smtp_password:
        logger.error("SMTP credentials not found in environment variables")
        return False

    try:
        logger.info(f"Preparing email for customer: {customer.email} with order {resi_number}")
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = customer.email
        msg['Subject'] = f'Konfirmasi Pesanan - Nomor Resi {resi_number}'

        logger.debug(f"Email headers configured - From: {smtp_email}, To: {customer.email}")

        # Send email
        logger.info("Connecting to Gmail SMTP server")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        logger.info("SMTP TLS connection established")
        server.login(smtp_email, smtp_password)
        logger.info("SMTP authentication successful")
        text = msg.as_string()
        server.sendmail(smtp_email, customer.email, text)
        server.quit()

        logger.info(f"Email sent successfully to {customer.email} for order {resi_number}")
        return True

    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {e}")
        return False
    except smtplib.SMTPConnectError as e:
        logger.error(f"SMTP Connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during email sending: {e}", exc_info=True)
        return False

rag_engine = RAGEngine()

@app.get("/api/debug")
async def debug_endpoint():
    """Debug endpoint to check system status"""
    try:
        df_shape = rag_engine.df.shape
        sample_row = rag_engine.df.iloc[0].to_dict() if not rag_engine.df.empty else "No data"
        return {
            "status": "OK",
            "dataframe_shape": df_shape,
            "sample_row": sample_row,
            "total_products": len(rag_engine.df)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    from models import SettingsDB
    try:
        settings = db.query(SettingsDB).first()
        if settings:
            return {"whatsapp_number": settings.whatsapp_number}
        # Fallback if table is empty
        return {"whatsapp_number": "6287819281389"}
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        return {"whatsapp_number": "6287819281389"}

@app.get("/api/products")
async def get_products():
    """Get all products from CSV catalog"""
    logger.info("=== PRODUCTS ENDPOINT CALLED ===")
    try:
        logger.info("Testing CSV access...")
        rag_engine.reload_catalog()  # Force reload from DB to prevent empty state
        df = rag_engine.df
        logger.info(f"DataFrame shape: {df.shape}")

        if df.empty:
            logger.warning("DataFrame is empty")
            return {"products": []}

        # Simple approach: convert entire dataframe to dict
        logger.info("Converting DataFrame to products...")
        products_data = df.to_dict('records')
        logger.info(f"Raw data has {len(products_data)} records")

        products = []
        for i, item in enumerate(products_data):
            try:
                product = {
                    "name": str(item.get("name", "")),
                    "price": str(item.get("price", "")),
                    "stock": int(item.get("stock", 0)),
                    "age_category": str(item.get("age_category", "")),
                    "protein": str(item.get("protein", "")) if item.get("protein") != "N/A" else "",
                    "description": str(item.get("description", "")),
                    "image_url": str(item.get("image_url", "")) if pd.notna(item.get("image_url")) else "",
                }
                products.append(product)
                if i < 3:  # Log first 3 products
                    logger.debug(f"Product {i}: {product['name']} - {product['protein']}")
            except Exception as conv_error:
                logger.error(f"Error converting item {i}: {conv_error}")
                continue

        logger.info(f"FINAL: Returning {len(products)} products")
        return {"products": products}

    except Exception as e:
        logger.error(f"CRITICAL ERROR in get_products: {e}", exc_info=True)
        return {"error": f"Failed to retrieve products: {str(e)}", "products": []}

@app.post("/api/admin/login")
async def admin_login(req: LoginRequest, db: Session = Depends(get_db)):
    from models import AdminDB
    admin = db.query(AdminDB).filter(AdminDB.username == req.username).first()
    if admin and admin.password == req.password:
        return {"success": True, "token": os.getenv("ADMIN_TOKEN", "demo_admin_token_123")}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/admin/products")
async def create_product(product: ProductCreate, authorized: bool = Depends(verify_admin), db: Session = Depends(get_db)):
    try:
        existing = db.query(ProductDB).filter(ProductDB.name == product.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Product already exists")
        
        new_prod = ProductDB(**product.dict())
        db.add(new_prod)
        db.commit()
        
        rag_engine.reload_catalog()
        return {"success": True, "message": "Produk berhasil ditambahkan"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/products/{product_name}")
async def update_product(product_name: str, product: ProductUpdate, authorized: bool = Depends(verify_admin), db: Session = Depends(get_db)):
    try:
        existing = db.query(ProductDB).filter(ProductDB.name == product_name).first()
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
            
        for key, value in product.dict().items():
            setattr(existing, key, value)
            
        db.commit()
        
        rag_engine.reload_catalog()
        return {"success": True, "message": "Produk berhasil diupdate"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/products/{product_name}")
async def delete_product(product_name: str, authorized: bool = Depends(verify_admin), db: Session = Depends(get_db)):
    try:
        existing = db.query(ProductDB).filter(ProductDB.name == product_name).first()
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
            
        db.delete(existing)
        db.commit()
        
        rag_engine.reload_catalog()
        return {"success": True, "message": "Produk berhasil dihapus"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    from models import OrderDB
    from datetime import datetime
    try:
        new_order = OrderDB(
            **order.dict(),
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return new_order
    except Exception as e:
        logger.error(f"Error creating order: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(authorized: bool = Depends(verify_admin), db: Session = Depends(get_db)):
    from models import OrderDB
    from datetime import datetime, timedelta
    try:
        # Hapus pesanan pending yang berumur lebih dari 24 jam
        threshold = datetime.now() - timedelta(hours=24)
        threshold_str = threshold.strftime("%Y-%m-%d %H:%M:%S")
        
        expired_orders = db.query(OrderDB).filter(
            OrderDB.status == "pending",
            OrderDB.created_at < threshold_str
        ).all()
        
        if expired_orders:
            for eo in expired_orders:
                db.delete(eo)
            db.commit()

        orders = db.query(OrderDB).order_by(OrderDB.id.desc()).all()
        return orders
    except Exception as e:
        logger.error(f"Error fetching orders: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/orders/{order_id}/confirm")
async def confirm_order(order_id: int, authorized: bool = Depends(verify_admin), db: Session = Depends(get_db)):
    from models import OrderDB, ProductDB
    import json
    try:
        order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.status == "confirmed":
            return {"success": True, "message": "Pesanan sudah dikonfirmasi sebelumnya"}
            
        # Parse items dan kurangi stok produk
        items = []
        try:
            items = json.loads(order.items)
        except Exception:
            pass
            
        for item in items:
            product_name = item.get("name")
            quantity = item.get("quantity", 0)
            if product_name and quantity > 0:
                product_row = db.query(ProductDB).filter(ProductDB.name == product_name).first()
                if product_row:
                    if product_row.stock >= quantity:
                        product_row.stock -= quantity
                    else:
                        product_row.stock = 0 # Kurangi sampai 0 jika over-order
                        
        order.status = "confirmed"
        db.commit()
        
        # Update RAG Engine dengan data stok baru
        rag_engine.reload_catalog()
        
        return {"success": True, "message": "Order confirmed and stock updated"}
    except Exception as e:
        logger.error(f"Error confirming order: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def recommend(request: QueryRequest):
    logger.info("=== RECOMMENDATION REQUEST RECEIVED ===")
    logger.info(f"Query: '{request.query}'")
    logger.info(f"History length: {len(request.history)}")

    try:
        message, recommended_products = rag_engine.generate_response(
            query=request.query,
            history=request.history
        )

        logger.info(f"Generated response with {len(recommended_products)} recommendations")
        return {
            "message": message,
            "recommended_products": recommended_products
        }

    except Exception as e:
        logger.error(f"Recommendation processing failed: {e}", exc_info=True)
        return {
            "message": "Maaf, terjadi kesalahan teknis. Mohon coba lagi atau hubungi tim support PT Cipta Sama Abadi.",
            "recommended_products": []
        }

@app.post("/api/checkout", response_model=CheckoutResponse)
async def checkout(request: CheckoutRequest, db: Session = Depends(get_db)):
    logger.info("=== CHECKOUT REQUEST RECEIVED ===")
    logger.info(f"Customer: {request.customer.nama} ({request.customer.email})")
    logger.info(f"Order details: {len(request.items)} items, Total: Rp {request.total:,}")

    try:
        for item in request.items:
            product_name = item.product.get('name')
            quantity = item.quantity
            product_row = db.query(ProductDB).filter(ProductDB.name == product_name).first()
            
            if not product_row:
                logger.warning(f"Product not found: {product_name}")
                raise HTTPException(status_code=400, detail=f"Produk {product_name} tidak ditemukan")
            
            current_stock = product_row.stock
            
            if current_stock < quantity:
                logger.warning(f"Insufficient stock for {product_name}: stock={current_stock}, requested={quantity}")
                raise HTTPException(status_code=400, detail=f"Stock pakan {product_name} tidak mencukupi")
            
            product_row.stock = current_stock - quantity
            logger.info(f"Stock updated for {product_name}: {current_stock} -> {current_stock - quantity}")
        
        db.commit()
        logger.info("Database updated successfully")
        
        rag_engine.reload_catalog()
        logger.info("RAG engine catalog reloaded for real-time sync")

        # Generate random resi number
        import random
        import string
        resi_number = 'CSA-' + ''.join(random.choices(string.digits, k=8))
        logger.info(f"Generated order number: {resi_number}")

        # Send confirmation email
        logger.info("Initiating email delivery process")
        email_sent = send_order_email(
            customer=request.customer,
            items=request.items,
            total=request.total,
            resi_number=resi_number
        )

        if email_sent:
            logger.info(f"Order {resi_number} processed successfully - Email sent to {request.customer.email}")
            return CheckoutResponse(
                success=True,
                message="Pesanan berhasil diproses dan email konfirmasi telah dikirim",
                resi_number=resi_number
            )
        else:
            logger.warning(f"Order {resi_number} processed but email delivery failed")
            return CheckoutResponse(
                success=True,
                message="Pesanan berhasil diproses namun gagal mengirim email konfirmasi",
                resi_number=resi_number
            )

    except Exception as e:
        logger.error(f"Checkout processing failed: {e}", exc_info=True)
        return CheckoutResponse(
            success=False,
            message="Gagal memproses pesanan",
            resi_number=""
        )