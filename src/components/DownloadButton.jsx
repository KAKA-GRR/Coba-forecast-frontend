import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

const DownloadButton = () => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const predictions = await api.getPredictions();
      
      // Calculate changes
      const enrichedData = predictions.map((item, index) => {
        const prevPrice = index === 0 ? 23400 : predictions[index - 1].price;
        const changeUSD = item.price - prevPrice;
        const changePercent = ((changeUSD / prevPrice) * 100).toFixed(2);
        
        return {
          date: item.date,
          price: item.price,
          changeUSD,
          changePercent
        };
      });

      // Generate CSV
      const headers = ['Tanggal', 'Harga Prediksi', 'Perubahan USD', 'Perubahan %'];
      const csvContent = [
        headers.join(','),
        ...enrichedData.map(row => 
          `${row.date},${row.price},${row.changeUSD},${row.changePercent}%`
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `prediksi_nikel_${today}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "✅ Download Berhasil!",
        description: `File prediksi_nikel_${today}.csv telah diunduh.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "❌ Download Gagal",
        description: "Terjadi kesalahan saat mengunduh file.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex justify-center mb-8"
    >
      <Button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg"
      >
        <Download className="mr-2" size={24} />
        {downloading ? 'Mengunduh...' : '📥 Download Prediksi (CSV)'}
      </Button>
    </motion.div>
  );
};

export default DownloadButton;