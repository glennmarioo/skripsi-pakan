import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-24 sm:py-32 shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-72 h-72 rounded-full bg-cyan-300 opacity-20 blur-3xl mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
        <div className="inline-block mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm sm:text-base font-medium tracking-wide shadow-lg hover:bg-white/20 transition-colors cursor-default">
          🚀 Solusi Cerdas Peternakan Modern
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md leading-tight">
          Pakan Unggas <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Berkualitas</span> <br className="hidden sm:block" /> untuk Peternak Hebat
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100 drop-shadow-sm font-light leading-relaxed">
          Temukan rekomendasi pakan terbaik untuk ternak Anda dalam hitungan detik dengan bantuan AI Asisten Cerdas kami.
        </p>
      </div>
    </section>
  );
};