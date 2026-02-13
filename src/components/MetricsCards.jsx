import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Target, Database, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const MetricsCards = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getMetrics();
      if (!data) throw new Error("No data");
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError(true);
      toast({
        variant: "destructive",
        title: "Gagal memuat data",
        description: "Tidak dapat mengambil metrik terbaru.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 mb-8">
        <p className="text-red-600 mb-4">Gagal memuat data metrik.</p>
        <button 
          onClick={fetchMetrics}
          className="flex items-center gap-2 mx-auto bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
        >
          <RotateCcw size={16} /> Coba Lagi
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4 w-12"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Akurasi Model',
      value: `${metrics?.mape?.toFixed(2)}%`,
      subtitle: 'MAPE (Mean Absolute Percentage Error)',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      badge: metrics?.mape < 5 ? 'Excellent' : 'Good',
      badgeColor: metrics?.mape < 5 ? 'bg-green-500' : 'bg-blue-500'
    },
    {
      title: 'RMSE',
      value: `$${metrics?.rmse?.toFixed(2)}`,
      subtitle: 'Root Mean Square Error',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      badge: 'USD',
      badgeColor: 'bg-blue-500'
    },
    {
      title: 'R² Score',
      value: metrics?.r2_score?.toFixed(4),
      subtitle: 'Coefficient of Determination',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      badge: 'High Accuracy',
      badgeColor: 'bg-purple-500'
    },
    {
      title: 'Data Points',
      value: metrics?.data_points,
      subtitle: 'Training Dataset Size',
      icon: Database,
      color: 'from-orange-500 to-orange-600',
      badge: 'Months',
      badgeColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 relative overflow-hidden group"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform`}></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-10 h-10 bg-gradient-to-br ${card.color} text-white p-2 rounded-lg shadow-md`} />
              <span className={`${card.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                {card.badge}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">{card.title}</h3>
            <p className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">{card.value}</p>
            <p className="text-xs text-gray-400">{card.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsCards;