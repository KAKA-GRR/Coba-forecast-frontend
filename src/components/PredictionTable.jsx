import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, ArrowUpDown } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

const PredictionTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getPredictions();
        const enrichedData = data.map((item, index) => {
          const prevPrice = index === 0 ? 23400 : data[index - 1].price;
          const changeUSD = item.price - prevPrice;
          const changePercent = ((changeUSD / prevPrice) * 100).toFixed(2);
          
          return {
            ...item,
            changeUSD,
            changePercent: parseFloat(changePercent),
            status: changeUSD > 0 ? 'Naik' : changeUSD < 0 ? 'Turun' : 'Stabil'
          };
        });
        setPredictions(enrichedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...predictions].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setPredictions(sorted);
  };

  if (loading) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-hidden"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">📅 Detail Prediksi Bulanan</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-blue-100">
              {['Bulan', 'Harga Prediksi', 'Perubahan ($)', 'Perubahan (%)', 'Status'].map((header, idx) => (
                <th 
                  key={idx}
                  className="px-4 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-blue-600"
                  onClick={() => idx < 4 && handleSort(['date', 'price', 'changeUSD', 'changePercent'][idx])}
                >
                  <div className="flex items-center gap-1">
                    {header} {idx < 4 && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {predictions.map((pred, index) => {
              const isPositive = pred.changeUSD > 0;
              const isNegative = pred.changeUSD < 0;
              
              return (
                <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                    {new Date(pred.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-blue-600">
                    {formatCurrency(pred.price)}
                  </td>
                  <td className={`px-4 py-3.5 text-sm font-semibold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(pred.changeUSD)}
                  </td>
                  <td className={`px-4 py-3.5 text-sm ${isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-green-100' : isNegative ? 'bg-red-100' : 'bg-gray-100'}`}>
                      {isPositive ? '+' : ''}{pred.changePercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {isPositive ? <ArrowUpCircle size={16} className="text-green-500" /> : 
                       isNegative ? <ArrowDownCircle size={16} className="text-red-500" /> : 
                       <MinusCircle size={16} className="text-gray-400" />}
                      <span className="text-xs font-medium text-gray-600">{pred.status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PredictionTable;