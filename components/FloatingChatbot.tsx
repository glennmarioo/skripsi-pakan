'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse, RecommendedProduct } from '../types';
import { MessageBubble } from './MessageBubble';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { Headphones } from 'lucide-react';

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Halo! Saya Asisten Virtual PT Cipta Sama Abadi. Ada yang bisa saya bantu terkait ketersediaan dan rekomendasi pakan unggas kami hari ini?'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll logic
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Collect history from previous messages
    const history = messages.map(m => `${m.role}: ${m.content}`);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input, history }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data: ChatResponse = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        recommended_products: data.recommended_products,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan teknis. Mohon coba lagi atau hubungi tim support PT Cipta Sama Abadi.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="rag" className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div id="ragChatbox" className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold">FeedMaster AI (RAG Engine)</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-lg">&times;</button>
          </div>
          {/* Message Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-slate-50">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold flex-shrink-0">AI</div>
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  <span className="ml-1">Mencari referensi dokumen...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan seputar pakan..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Kirim
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 ml-auto block"
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};