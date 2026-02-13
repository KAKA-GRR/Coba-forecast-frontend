import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

const PriceChangeChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getPriceChanges();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching price changes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-md text-sm border border-gray-100">
          <p className="font-bold mb-1">{new Date(data.month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
          <div className="space-y-1">
            <p className="text-gray-500">Harga: {formatCurrency(data.currentPrice)}</p>
            <p className={data.changeUSD >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {data.changeUSD >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(data.changeUSD))} ({data.changePercent}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>;

  if (!chartData || chartData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 h-64 flex items-center justify-center"
      >
        <p className="text-gray-500 text-center">Tidak ada data perubahan harga</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Volatilitas Bulanan (MoM)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short' })}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Bar dataKey="changeUSD" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.changeUSD >= 0 ? '#10B981' : '#EF4444'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PriceChangeChart;