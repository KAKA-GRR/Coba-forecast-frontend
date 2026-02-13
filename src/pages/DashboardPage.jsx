import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from '@/components/Header';
import MetricsCards from '@/components/MetricsCards';
import PriceChart from '@/components/PriceChart';
import PriceChangeChart from '@/components/PriceChangeChart';
import PredictionTable from '@/components/PredictionTable';
import DownloadButton from '@/components/DownloadButton';
import AutoRefresh from '@/components/AutoRefresh';
import CommodityComparison from '@/components/CommodityComparison';
import AIInsights from '@/components/AIInsights';
import ExportPDF from '@/components/ExportPDF';

const DashboardPage = () => {
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleRefresh = async () => {
    // Logic to re-trigger data fetches in child components
    // In a real app with Redux/Context, we would dispatch an action here.
    // For this prototype, we simulate a refresh by updating the timestamp
    // which components could listen to if passed as prop, or we rely on their internal effect.
    // Here we just update the UI timestamp to show activity.
    await new Promise(r => setTimeout(r, 800));
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard Prediksi Nikel | AI Analytics</title>
        <meta name="description" content="Platform analitik harga nikel berbasis AI dengan model GRU." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50/50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/settings" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Settings size={24} />
            </Link>
            <AutoRefresh onRefresh={handleRefresh} lastUpdated={lastUpdated} />
          </div>

          <Header />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <MetricsCards />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <PriceChart />
            </div>
            <div className="lg:col-span-1">
              <AIInsights />
              <PriceChangeChart />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            <CommodityComparison />
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            <PredictionTable />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <DownloadButton />
            <ExportPDF />
          </div>

          <footer className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">© 2026 NickelAI Prediction System. Powered by TensorFlow & Flask.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;