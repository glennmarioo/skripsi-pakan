import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const HeroSection: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center transition-colors"
    >
      <motion.div variants={itemVariants}>
        <Badge variant="brand" className="mb-6">
          Sistem Informasi Manajemen Pakan Unggas
        </Badge>
      </motion.div>
      
      <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight transition-colors">
        PT. Cipta Sama Abadi
      </motion.h1>
      
      <motion.p variants={itemVariants} className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
        Platform e-commerce dan manajemen stok pakan yang mempermudah peternak dalam pemesanan dan pencarian informasi pakan unggas.
      </motion.p>
    </motion.section>
  );
};