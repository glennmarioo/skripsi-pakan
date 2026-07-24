import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center"
    >
      <motion.div variants={itemVariants}>
        <Badge variant="brand" className="mb-6">
          Sistem Informasi Manajemen Pakan Unggas
        </Badge>
      </motion.div>
      
      <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
        PT. Cipta Sama Abadi
      </motion.h1>
      
      <motion.p variants={itemVariants} className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
        Platform e-commerce dan manajemen stok pakan yang mempermudah peternak dalam pemesanan dan pencarian informasi pakan unggas.
      </motion.p>
      
      <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row justify-center gap-4 items-center w-full sm:w-auto">
        <Button 
          variant="primary" 
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => {
            document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Lihat Katalog Pakan
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => {
            window.location.href = '/admin/login';
          }}
        >
          Buka Dasbor Admin
        </Button>
      </motion.div>
    </motion.section>
  );
};