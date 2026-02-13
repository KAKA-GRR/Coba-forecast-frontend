import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AutoRefresh = ({ onRefresh, lastUpdated }) => {
  const [enabled, setEnabled] = useState(false);
  const [intervalTime, setIntervalTime] = useState(15 * 60 * 1000); // 15 mins default
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let interval;
    if (enabled) {
      interval = setInterval(async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [enabled, intervalTime, onRefresh]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 border-r pr-3 mr-1">
        <motion.button 
          onClick={handleManualRefresh}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
          className="p-1.5 hover:bg-gray-100 rounded-full text-blue-600"
          title="Refresh sekarang"
        >
          <RefreshCw size={18} />
        </motion.button>
        <div className="text-xs text-gray-500">
          <p>Terakhir update:</p>
          <p className="font-medium text-gray-700">{lastUpdated || 'Baru saja'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600">Auto</span>
        </label>
        
        {enabled && (
          <select 
            value={intervalTime} 
            onChange={(e) => setIntervalTime(Number(e.target.value))}
            className="text-xs border rounded p-1 bg-gray-50 outline-none"
          >
            <option value={900000}>15 Menit</option>
            <option value={1800000}>30 Menit</option>
            <option value={3600000}>1 Jam</option>
            <option value={7200000}>2 Jam</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default AutoRefresh;