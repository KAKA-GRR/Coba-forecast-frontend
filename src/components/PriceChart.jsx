import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { mockData } from '@/lib/mockData';
import DateRangePicker from './DateRangePicker';

const PriceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '2021-02-01', end: '2027-02-01' });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Gunakan mock data langsung untuk test
        const historical = mockData.historical;
        const predictions = mockData.predictions;

        console.log('Historical:', historical.length, 'Predictions:', predictions.length);

        // Buat map dari historical data
        const historicalMap = {};
        historical.forEach(item => {
          historicalMap[item.date] = item.price;
        });

        // Buat map dari predictions data
        const predictionsMap = {};
        predictions.forEach(item => {
          predictionsMap[item.date] = item.price;
        });

        // Gabungkan semua dates
        const allDates = new Set([
          ...historical.map(h => h.date),
          ...predictions.map(p => p.date)
        ]);

        // Buat combined data dengan struktur yang tepat untuk Recharts
        const combined = Array.from(allDates)
          .sort()
          .map(date => ({
            date,
            historical: historicalMap[date] || null,
            predictions: predictionsMap[date] || null
          }));

        console.log('Combined data:', combined.length);
        setChartData(combined);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      const filtered = chartData.filter(d => 
        d.date >= dateRange.start && d.date <= dateRange.end
      );
      console.log('Filtered data points:', filtered.length);
      setFilteredData(filtered);
    } else {
      console.log('ChartData is empty');
      setFilteredData([]);
    }
  }, [dateRange, chartData]);

  const handleRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-blue-100">
          <p className="font-bold text-gray-800 mb-2 border-b pb-1">
             {new Date(data.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
          {data.historical && (
            <p className="text-blue-600 font-semibold flex justify-between gap-4">
              <span>Historis:</span> <span>${data.historical.toLocaleString()}</span>
            </p>
          )}
          {data.predictions && (
            <p className="text-red-500 font-semibold flex justify-between gap-4">
              <span>Prediksi:</span> <span>${data.predictions.toLocaleString()}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📈 Grafik Harga Nikel</h2>
          <p className="text-sm text-gray-500">Visualisasi data historis dan forecast masa depan</p>
        </div>
        <DateRangePicker 
          startDate={dateRange.start} 
          endDate={dateRange.end} 
          onRangeChange={handleRangeChange} 
        />
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
            }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <ReferenceLine x="2026-02-01" stroke="#9CA3AF" strokeDasharray="3 3" label="Now" />
          <Line 
            type="monotone" 
            dataKey="historical" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={false}
            name="Data Historis"
            connectNulls
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="predictions" 
            stroke="#EF4444" 
            strokeWidth={3}
            strokeDasharray="4 4"
            dot={{ fill: '#EF4444', r: 4, strokeWidth: 0 }}
            name="Prediksi AI"
            connectNulls
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PriceChart;