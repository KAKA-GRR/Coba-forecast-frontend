import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { normalizeDataForComparison } from '@/lib/chartHelpers';
import { formatCurrency } from '@/lib/formatters';

const CommodityComparison = () => {
  const [data, setData] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [isNormalized, setIsNormalized] = useState(false);
  const [selectedCommodities, setSelectedCommodities] = useState({
    nikel: true,
    emas: true,
    batubara: true
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getCommodities();
      setData(result);
      setNormalizedData(normalizeDataForComparison(result, ['nikel', 'emas', 'batubara']));
    };
    fetchData();
  }, []);

  const toggleCommodity = (key) => {
    setSelectedCommodities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = isNormalized ? normalizedData : data;

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-[350px] flex items-center justify-center">
        <p className="text-gray-500 text-center">Memuat data komoditas...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">⚖️ Komparasi Komoditas</h2>
        
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            {['nikel', 'emas', 'batubara'].map(c => (
              <button 
                key={c}
                onClick={() => toggleCommodity(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                  selectedCommodities[c] 
                    ? c === 'nikel' ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : c === 'emas' ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : 'bg-gray-800 text-white border-gray-600'
                    : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="border-l pl-4">
            <button 
              onClick={() => setIsNormalized(!isNormalized)}
              className="text-xs font-medium text-gray-600 hover:text-blue-600 underline"
            >
              {isNormalized ? 'Lihat Harga Asli' : 'Lihat Mode % (Normalized)'}
            </button>
          </div>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip 
              formatter={(value, name) => [
                isNormalized ? `${value.toFixed(2)}%` : formatCurrency(value),
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            />
            <Legend />
            {selectedCommodities.nikel && (
              <Line type="monotone" dataKey="nikel" stroke="#3B82F6" strokeWidth={2} dot={false} name="Nikel" />
            )}
            {selectedCommodities.emas && (
              <Line type="monotone" dataKey="emas" stroke="#EAB308" strokeWidth={2} dot={false} name="Emas" />
            )}
            {selectedCommodities.batubara && (
              <Line type="monotone" dataKey="batubara" stroke="#374151" strokeWidth={2} dot={false} name="Batubara" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommodityComparison;