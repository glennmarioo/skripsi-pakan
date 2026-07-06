export interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommended_products?: RecommendedProduct[];
}

export interface RecommendedProduct {
  name: string;
  price: number | string;
  stock: number;
  image_url?: string;
}

export interface ChatResponse {
  message: string;
  recommended_products: RecommendedProduct[];
}