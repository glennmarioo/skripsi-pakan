'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { FloatingChatbot } from '../components/FloatingChatbot';
import { CartSidebar } from '../components/CartSidebar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />
      <ProductGrid searchQuery={searchQuery} />
      <FloatingChatbot />
      <CartSidebar />
    </div>
  );
}