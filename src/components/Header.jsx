import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-12 px-6 rounded-2xl shadow-2xl mb-8"
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap');
        `}
      </style>
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          ⛏️ Prediksi Harga Nikel dengan GRU
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-blue-100 mb-4 font-medium"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Machine Learning Model untuk Peramalan Harga Komoditas
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-semibold"
        >
          📅 Data terakhir diperbarui: 01 Februari 2026
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;