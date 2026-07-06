import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-800 to-blue-500 text-white py-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Solusi Pakan Unggas Berkualitas untuk Peternak Indonesia</h2>
        <p className="text-xl mb-8">Temukan pakan terbaik untuk ternak Anda dengan bantuan AI kami</p>
        <p className="text-lg">Peternak hebat memilih pakan berkualitas untuk hasil maksimal</p>
      </div>
    </section>
  );
};