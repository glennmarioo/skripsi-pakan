# PT. Cipta Sama Abadi - E-Commerce Poultry Feed Platform

Platform E-Commerce canggih untuk penjualan pakan ternak unggas dengan integrasi AI assistant menggunakan RAG (Retrieval-Augmented Generation).

## 🚀 Quick Start

### Menggunakan Docker (Recommended)

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd cipta-sama-abadi
   ```

2. **Setup environment:**
   ```bash
   # Pastikan file 'env' ada dengan konfigurasi yang benar
   # GEMINI_API_KEY=your_api_key_here
   # SMTP_EMAIL=your_email@gmail.com
   # SMTP_PASSWORD=your_app_password
   ```

3. **Build dan jalankan dengan Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Akses aplikasi:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup (Development)

1. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python 3.12
- **AI:** Google Gemini with RAG
- **Database:** CSV-based (production-ready for PostgreSQL migration)
- **Email:** Gmail SMTP
- **Containerization:** Docker & Docker Compose

### Key Features
- ✅ **Product Catalog:** 32 poultry feed products
- ✅ **AI Assistant:** RAG-powered recommendations
- ✅ **Shopping Cart:** Real-time state management
- ✅ **Checkout System:** Form validation + email confirmation
- ✅ **Search & Filter:** Real-time product filtering
- ✅ **Responsive Design:** Mobile-first approach
- ✅ **Enterprise Logging:** Structured logging system
- ✅ **Docker Ready:** Production containerization

## 📁 Project Structure

```
cipta-sama-abadi/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CartContext.tsx    # Cart state management
│   ├── Navbar.tsx         # Navigation with search
│   ├── ProductGrid.tsx    # Product catalog
│   ├── ProductCard.tsx    # Individual product cards
│   ├── CartSidebar.tsx    # Shopping cart sidebar
│   ├── CheckoutForm.tsx   # Checkout form modal
│   └── FloatingChatbot.tsx # AI assistant
├── context/               # React contexts
│   └── CartContext.tsx    # Global cart state
├── types/                 # TypeScript definitions
│   └── index.ts          # Type definitions
├── main.py               # FastAPI backend
├── rag_engine.py         # RAG AI engine
├── katalog_pakan.csv     # Product database
├── env                   # Environment variables
├── requirements.txt      # Python dependencies
├── package.json          # Node dependencies
├── Dockerfile.backend    # Backend container
├── Dockerfile.frontend   # Frontend container
├── docker-compose.yml    # Container orchestration
└── .dockerignore         # Docker ignore rules
```

## 🔧 Configuration

### Environment Variables (`env`)
```env
GEMINI_API_KEY=your_gemini_api_key
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Getting Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Create new API key
3. Add to `env` file

### Gmail App Password Setup
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password in `env` file

## 📡 API Endpoints

### Backend API (Port 8000)
- `POST /api/recommend` - AI product recommendations
- `POST /api/checkout` - Order processing with email

### Request Examples

**AI Recommendation:**
```json
{
  "query": "pakan ayam starter",
  "history": ["saya butuh pakan untuk ayam"]
}
```

**Checkout:**
```json
{
  "customer": {
    "nama": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "alamat": "Jl. Example No. 123"
  },
  "items": [
    {
      "product": {"name": "BR11", "price": "Rp 450.000"},
      "quantity": 2
    }
  ],
  "total": 900000
}
```

## 🐳 Docker Commands

```bash
# Build containers
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build --force-recreate
```

## 📊 Monitoring & Logs

### Backend Logs
- **Console Output:** Structured logging with timestamps
- **File Logging:** Saved to `logs/app.log`
- **Log Levels:** INFO, WARNING, ERROR with context

### Health Checks
- **Backend:** `/docs` endpoint monitoring
- **Frontend:** Health check endpoint
- **Docker:** Container health monitoring

## 🔒 Security Features

- **Input Validation:** Pydantic models for API validation
- **Environment Variables:** Sensitive data not in code
- **CORS Configuration:** Controlled cross-origin requests
- **Error Handling:** Structured error responses
- **Rate Limiting:** Ready for implementation

## 🚀 Deployment Ready

### Production Checklist
- ✅ Containerized with Docker
- ✅ Environment-based configuration
- ✅ Structured logging
- ✅ Health checks implemented
- ✅ Error handling robust
- ✅ API documentation available
- ✅ Database migration ready

### Scaling Considerations
- **Database:** Migrate from CSV to PostgreSQL
- **Caching:** Implement Redis for session management
- **CDN:** Static assets delivery
- **Load Balancing:** Multiple container instances
- **Monitoring:** Application performance monitoring

## 📈 Performance Metrics

- **Frontend Load Time:** ~2 seconds (development)
- **API Response Time:** <1 second (local)
- **Search Speed:** Instant (client-side filtering)
- **Email Delivery:** Near-instant (Gmail SMTP)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is proprietary software for PT. Cipta Sama Abadi.

## 📞 Support

For technical support, contact the development team.

---

**Built with ❤️ for PT. Cipta Sama Abadi - Empowering Indonesian Poultry Farmers**