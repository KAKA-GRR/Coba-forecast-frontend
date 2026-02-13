import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, onRangeChange }) => {
  
  const handlePreset = (years) => {
    const end = new Date();
    const start = new Date();
    if (years === 'all') {
      onRangeChange('2021-02-01', '2027-02-01');
    } else {
      start.setFullYear(end.getFullYear() - years);
      onRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700">
        <CalendarIcon size={20} className="text-blue-500" />
        <span className="font-medium">Periode:</span>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => onRangeChange(e.target.value, endDate)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <span className="self-center text-gray-400">-</span>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => onRangeChange(startDate, e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex gap-2 ml-auto">
        <button onClick={() => handlePreset(1)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-600 transition-colors">
          1 Tahun
        </button>
        <button onClick={() => handlePreset(2)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-600 transition-colors">
          2 Tahun
        </button>
        <button onClick={() => handlePreset('all')} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium transition-colors">
          Semua Data
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;