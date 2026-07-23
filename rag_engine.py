import logging
import pandas as pd
import google.genai as genai
from dotenv import load_dotenv
import os
import re
import csv
from datetime import datetime
from database import engine

logger = logging.getLogger(__name__)

class RAGEngine:
    def __init__(self):
        logger.info("Initializing RAG Engine...")
        load_dotenv()  # Load from .env file
        api_key = os.getenv('GEMINI_API_KEY')
        logger.info(f"Gemini API key loaded: {bool(api_key)}")

        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment variables")
            raise ValueError("GEMINI_API_KEY environment variable is required")

        try:
            self.client = genai.Client(api_key=api_key)
            logger.info("Gemini client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")
            raise

        try:
            self.df = pd.read_sql("SELECT * FROM products", con=engine)
            logger.info(f"Product catalog loaded from database: {len(self.df)} products")
        except Exception as e:
            logger.error(f"Failed to load product catalog from database: {e}")
            # Fallback for initialization
            self.df = pd.DataFrame()

    def reload_catalog(self):
        try:
            self.df = pd.read_sql("SELECT * FROM products", con=engine)
            logger.info(f"Catalog reloaded from database: {len(self.df)} products")
        except Exception as e:
            logger.error(f"Failed to reload product catalog from database: {e}")
    
    def retrieve(self, query, history=[]):
        self.reload_catalog()
        
        search_query = query
        # Extract last user message for context if available
        user_messages = [msg.split("user:", 1)[1].strip() for msg in history if msg.lower().startswith("user:")]
        if user_messages:
            search_query = f"{user_messages[-1]} {query}"
            
        query_lower = search_query.lower()
        query_words = query_lower.split()
        
        analytical_keywords = ['stok', 'terbanyak', 'sedikit', 'murah', 'mahal', 'harga', 'kosong', 'habis']
        if any(kw in query_lower for kw in analytical_keywords):
            return self.df
            
        relevant = self.df[self.df.apply(lambda row: any(word in (row['name'] + ' ' + row['description']).lower() for word in query_words), axis=1)]
        
        if relevant.empty:
            return self.df
            
        return relevant

    def sort_results(self, df, query):
        query_lower = query.lower()
        if any(kw in query_lower for kw in ["murah", "termurah", "paling murah"]):
            # Sort by price ascending
            def parse_price(price_str):
                try:
                    return float(price_str.replace("Rp ", "").replace(".", ""))
                except:
                    return float('inf')
            df = df.copy()
            df['price_num'] = df['price'].apply(parse_price)
            df = df.sort_values('price_num')
        elif any(kw in query_lower for kw in ["mahal", "paling mahal"]):
            # Sort by price descending
            def parse_price(price_str):
                try:
                    return float(price_str.replace("Rp ", "").replace(".", ""))
                except:
                    return float('-inf')
            df = df.copy()
            df['price_num'] = df['price'].apply(parse_price)
            df = df.sort_values('price_num', ascending=False)
        elif any(kw in query_lower for kw in ["protein tertinggi", "protein tinggi"]):
            # Sort by protein descending
            def parse_protein(prot_str):
                try:
                    return float(prot_str.replace("%", "").replace("N/A", "0"))
                except:
                    return 0
            df = df.copy()
            df['protein_num'] = df['protein'].apply(parse_protein)
            df = df.sort_values('protein_num', ascending=False)
        return df.drop(columns=[col for col in df.columns if col.endswith('_num')], errors='ignore')
    
    def generate_response(self, query, history=[]):
        logger.info(f"Processing query: '{query}'")
        logger.debug(f"Conversation history length: {len(history)}")

        relevant_df = self.retrieve(query, history)
        if relevant_df.empty:
            logger.warning(f"No relevant products found for query: {query}")
            context = "Tidak ada produk yang cocok ditemukan di katalog PT Cipta Sama Abadi."
        else:
            relevant_df = self.sort_results(relevant_df, query)
            logger.info(f"Found {len(relevant_df)} relevant products after sorting")
            context = relevant_df.to_string()

        logger.debug(f"Context prepared with length: {len(context)} characters")

        history_text = "\n".join(history) if history else ""
        system_prompt = """Kamu adalah AI Konsultan Pakan resmi PT. Cipta Sama Abadi, berlokasi di Parung, Bogor.
Sebagai asisten resmi, kamu bertugas menjawab semua pertanyaan terkait pakan unggas dari katalog, SERTA pertanyaan profil toko seperti lokasi.

TUGAS UTAMA:
- Jika pengguna bertanya produk/harga/stok: Berikan rekomendasi maksimal 3 produk terbaik dari katalog CSV yang diberikan. Jika ada produk mirip (misal BR12 dan 512B), kamu BOLEH menggunakan pengetahuan AI eksternal untuk membandingkan perbedaan merek/kualitas agar pembeli tidak bingung. Dilarang keras mengarang harga/stok.
- Jika pengguna bertanya lokasi/alamat toko: Langsung jawab bahwa toko PT Cipta Sama Abadi berlokasi di Parung, Bogor. JANGAN menolak menjawab pertanyaan lokasi.
- Jika pengguna hanya menyapa: Balas sapaan dengan ramah tanpa menyebutkan stok.
- Jika pertanyaan di luar peternakan atau profil toko: Tolak dengan sopan.

Pastikan kamu merespons dengan bahasa Indonesia yang ramah, sopan, dan profesional. Hindari penggunaan markdown tebal (bold) atau miring (italic)."""

        prompt = f"""Conversation history:
{history_text}

Katalog produk resmi kami:
{context}

Pertanyaan pelanggan:
{query}

Jawaban AI:"""

        try:
            logger.info("Sending request to Gemini AI")
            response = self.client.models.generate_content(
                model="models/gemini-3.1-flash-lite",
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.3
                )
            )
            logger.info("Gemini AI response received successfully")
            logger.debug(f"Response length: {len(response.text)} characters")

            # Dynamic Matching: Masking & Positional Sorting
            gemini_text = response.text.lower()
            matched_items = []

            sorted_df = self.df.copy()
            sorted_df['name_len'] = sorted_df['name'].apply(lambda x: len(str(x)))
            sorted_df = sorted_df.sort_values(by='name_len', ascending=False)

            temp_text = gemini_text
            for _, row in sorted_df.iterrows():
                name_lower = str(row['name']).lower()
                if name_lower in temp_text:
                    pos = gemini_text.find(name_lower)
                    
                    formatted_row = {
                        "name": row["name"],
                        "age_category": row["age_category"],
                        "protein": str(row["protein"]) if not pd.isna(row["protein"]) else "N/A",
                        "price": row["price"],
                        "description": row["description"] if not pd.isna(row["description"]) else "",
                        "stock": int(row["stock"]),
                        "image_url": str(row.get("image_url", "")) if pd.notna(row.get("image_url")) else ""
                    }
                    
                    matched_items.append((pos, formatted_row))
                    temp_text = temp_text.replace(name_lower, " " * len(name_lower))

            matched_items.sort(key=lambda x: x[0])

            if matched_items:
                sources = [item[1] for item in matched_items][:3]
            else:
                sources = []

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

            logger.info(f"Returning {len(sources)} product recommendations")
            return response.text, sources

        except Exception as e:
            logger.error(f"Gemini AI request failed: {e}")

            if "429" in str(e) or "quota" in str(e).lower():
                logger.warning("Rate limit exceeded, waiting 60 seconds before retry")
                import time
                time.sleep(60)  # Wait 1 minute for quota reset
                try:
                    logger.info("Retrying Gemini AI request after quota reset")
                    response = self.client.models.generate_content(
                        model="models/gemini-3.1-flash-lite",
                        contents=prompt
                    )
                    logger.info("Retry successful")
                    return response.text, sources
                except Exception as retry_error:
                    logger.error(f"Retry also failed: {retry_error}")
                    return "Quota exceeded, please try again later.", []

            logger.error(f"Unexpected error in AI response generation: {e}")
            return f"Error generating response: {str(e)}", []