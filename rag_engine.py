import logging
import pandas as pd
import google.genai as genai
from dotenv import load_dotenv
import os
import csv
from datetime import datetime
from database import engine

# Import LangChain & FAISS (Sesuai klaim di Bab 2 dan Bab 4 Skripsi)
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
try:
    from langchain.retrievers import EnsembleRetriever
except ImportError:
    try:
        from langchain.retrievers.ensemble import EnsembleRetriever
    except ImportError:
        from langchain_classic.retrievers.ensemble import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

logger = logging.getLogger(__name__)

class RAGEngine:
    def __init__(self):
        logger.info("Initializing Real RAG Engine (FAISS + Cosine Similarity)...")
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
            
        self.client = genai.Client(api_key=api_key)
        
        # Initialize Embeddings Model (Sesuai dengan screenshot code di Halaman 43)
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        self.vectorstore = None
        self.ensemble_retriever = None
        self.df = pd.DataFrame()
        
        self.reload_catalog()

    def reload_catalog(self):
        try:
            self.df = pd.read_sql("SELECT * FROM products", con=engine)
            logger.info(f"Catalog loaded: {len(self.df)} products. Building FAISS index...")
            
            documents = []
            for _, row in self.df.iterrows():
                # Membangun representasi semantik pakan
                content = (
                    f"Nama Produk: {row['name']}. "
                    f"Harga: {row['price']}. "
                    f"Kategori Umur: {row['age_category']}. "
                    f"Protein: {row['protein']}. "
                    f"Deskripsi: {row['description']}. "
                    f"Stok Tersedia: {row['stock']} karung."
                )
                doc = Document(page_content=content, metadata={"name": row["name"]})
                documents.append(doc)
            
            if documents:
                # Membuat Vector Database lokal dengan FAISS (Cosine Similarity)
                self.vectorstore = FAISS.from_documents(documents, self.embeddings)
                self.vectorstore.save_local("faiss_index")
                
                # Hybrid Search: BM25 (Keyword Matching) + FAISS (Semantic)
                bm25_retriever = BM25Retriever.from_documents(documents)
                bm25_retriever.k = 10
                
                faiss_retriever = self.vectorstore.as_retriever(search_kwargs={"k": 10})
                
                self.ensemble_retriever = EnsembleRetriever(
                    retrievers=[bm25_retriever, faiss_retriever], weights=[0.5, 0.5]
                )
                
                logger.info("Hybrid Search (EnsembleRetriever BM25 + FAISS) built successfully.")
                
        except Exception as e:
            logger.error(f"Failed to reload product catalog from database: {e}")

    def retrieve(self, query, k=15):
        if not hasattr(self, 'ensemble_retriever') or not self.ensemble_retriever:
            return pd.DataFrame()
            
        # Menggunakan algoritma Hybrid Search (BM25 + FAISS Cosine Similarity)
        # Catatan: k disetel ke 10 dari masing-masing retriever saat diinisialisasi
        docs = self.ensemble_retriever.invoke(query)
        
        # Ekstrak nama produk yang relevan dari metadata vektor
        relevant_names = [doc.metadata["name"] for doc in docs]
        
        # Filter dataframe asli berdasarkan hasil pencarian vektor
        relevant_df = self.df[self.df['name'].isin(relevant_names)]
        return relevant_df

    def generate_response(self, query, history=[]):
        logger.info(f"Processing query via RAG: '{query}'")
        
        # 1. RETRIEVAL PHASE (Cosine Similarity via FAISS)
        relevant_df = self.retrieve(query)
        
        if relevant_df.empty:
            context = "Tidak ada produk yang relevan ditemukan di katalog PT Cipta Sama Abadi."
        else:
            context = relevant_df.to_string(index=False)
            
        history_text = "\n".join(history) if history else ""
        
        # Prompt Engineering ketat untuk mencegah halusinasi
        system_prompt = """Kamu adalah AI Konsultan Pakan resmi PT. Cipta Sama Abadi, berlokasi di Parung, Bogor.
Sebagai asisten resmi, kamu bertugas menjawab semua pertanyaan terkait pakan unggas dari katalog yang diberikan.

TUGAS UTAMA:
- Berikan rekomendasi produk terbaik BERDASARKAN KONTEKS KATALOG yang disuplai (menggunakan metode Retrieval-Augmented Generation).
- Jika pengguna bertanya lokasi/alamat toko: Langsung jawab bahwa toko PT Cipta Sama Abadi berlokasi di Parung, Bogor.
- Jika pengguna menyapa: Balas sapaan dengan ramah.
- Dilarang keras mengarang (halusinasi) nama pakan, harga, atau stok yang tidak ada di dalam konteks.
- Jawab dengan bahasa Indonesia yang ramah, profesional, dan to-the-point."""

        prompt = f"""Conversation history:
{history_text}

Konteks Dokumen (Hasil Ekstraksi Vektor):
{context}

Pertanyaan pelanggan:
{query}

Jawaban AI:"""

        try:
            logger.info("Sending prompt to Gemini 1.5 Flash")
            
            # 2. GENERATION PHASE (Menggunakan Gemini 3.1 Flash Lite)
            response = self.client.models.generate_content(
                model="models/gemini-3.1-flash-lite",
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.3
                )
            )
            
            gemini_text = response.text.lower()
            matched_items = []

            # Format rekomendasi produk untuk dikembalikan ke frontend keranjang
            for _, row in relevant_df.iterrows():
                name_lower = str(row['name']).lower()
                if name_lower in gemini_text:
                    pos = gemini_text.find(name_lower)
                    formatted_row = {
                        "name": row["name"],
                        "age_category": row["age_category"],
                        "protein": str(row["protein"]) if pd.notna(row.get("protein")) else "N/A",
                        "price": row["price"],
                        "description": row["description"] if pd.notna(row.get("description")) else "",
                        "stock": int(row["stock"]) if pd.notna(row.get("stock")) else 0,
                        "image_url": str(row.get("image_url", "")) if pd.notna(row.get("image_url")) else ""
                    }
                    matched_items.append((pos, formatted_row))
                    gemini_text = gemini_text.replace(name_lower, " " * len(name_lower))

            matched_items.sort(key=lambda x: x[0])
            sources = [item[1] for item in matched_items][:3]

            # Evaluation Logging
            log_file = 'qa_evaluation.csv'
            file_exists = os.path.isfile(log_file)
            try:
                with open(log_file, mode='a', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    if not file_exists:
                        writer.writerow(["Timestamp", "User_Query", "RAG_Context", "Gemini_Response"])
                    writer.writerow([
                        datetime.now().isoformat(),
                        query,
                        context,
                        response.text
                    ])
            except Exception as log_err:
                logger.error(f"Failed to log evaluation data: {log_err}")

            return response.text, sources

        except Exception as e:
            logger.error(f"Gemini AI request failed: {e}")
            return "Maaf, terjadi kesalahan teknis pada pemrosesan RAG.", []