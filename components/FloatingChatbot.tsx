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
      const response = await fetch('http://localhost:8000/api/recommend', {
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border border-gray-200 w-[calc(100vw-2rem)] sm:w-[400px] max-w-full h-[80vh] max-h-[600px] flex flex-col">
          <div className="bg-blue-800 text-white p-3 rounded-t-lg flex justify-between items-center shrink-0">
            <h4 className="font-semibold">Asisten Virtual PT Cipta Sama Abadi</h4>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg flex space-x-2 items-center shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya tentang pakan unggas..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-700 hover:bg-blue-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        {isOpen ? '✕' : <Headphones className="w-6 h-6" />}
      </button>
    </div>
  );
};