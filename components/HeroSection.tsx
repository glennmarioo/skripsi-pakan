import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-brand-50 text-brand-700 rounded-full mb-4 border border-brand-100 shadow-sm">
        Implementasi AI & RAG untuk Rekomendasi Pakan Unggas
      </span>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
        Sistem Rekomendasi Pakan Berbasis Data Real-Time
      </h1>
      <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
        Platform e-commerce dan manajemen pakan terintegrasi dengan Retrieval-Augmented Generation untuk akurasi dan efisiensi peternakan modern.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <a href="#katalog" onClick={(e) => {
            e.preventDefault();
            document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
        }} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-sm w-full sm:w-auto">
          Lihat Katalog Pakan
        </a>
        <a href="/admin/login" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-xl transition-all w-full sm:w-auto">
          Buka Dasbor Admin
        </a>
      </div>
    </section>
  );
};