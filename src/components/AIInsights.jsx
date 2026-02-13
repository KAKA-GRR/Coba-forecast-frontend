import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { generateAIInsights } from '@/lib/calculations';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [preds, metrics] = await Promise.all([
        api.getPredictions(),
        api.getMetrics()
      ]);
      setInsights(generateAIInsights(preds, metrics));
    };
    fetchData();
  }, []);

  if (!insights) return null;

  const bgGradient = 
    insights.recommendation === 'Beli' ? 'from-green-50 to-emerald-50 border-green-200' :
    insights.recommendation === 'Jual' ? 'from-red-50 to-rose-50 border-red-200' :
    'from-yellow-50 to-amber-50 border-yellow-200';

  const textColor = 
    insights.recommendation === 'Beli' ? 'text-green-700' :
    insights.recommendation === 'Jual' ? 'text-red-700' :
    'text-yellow-700';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-6 border bg-gradient-to-br ${bgGradient} shadow-sm mb-8`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <BrainCircuit className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">AI Market Insights</h3>
            <p className="text-xs text-gray-500">Analisis otomatis berdasarkan data prediksi</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${textColor} bg-white/50 shadow-sm`}>
          Rekomendasi: {insights.recommendation}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/60 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Arah Tren</p>
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            {insights.trend === 'Naik' ? <TrendingUp className="text-green-500" size={18} /> : 
             insights.trend === 'Turun' ? <TrendingDown className="text-red-500" size={18} /> :
             <Minus className="text-gray-500" size={18} />}
            {insights.trend}
          </div>
        </div>
        <div className="bg-white/60 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Volatilitas</p>
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <AlertTriangle className={insights.volatility === 'Tinggi' ? 'text-red-500' : 'text-yellow-500'} size={18} />
            {insights.volatility}
          </div>
        </div>
        <div className="bg-white/60 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Confidence Score</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${insights.confidence}%` }}></div>
          </div>
          <p className="text-right text-xs mt-1 font-medium">{insights.confidence}%</p>
        </div>
      </div>

      <ul className="space-y-2">
        {insights.points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AIInsights;