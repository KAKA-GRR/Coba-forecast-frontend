import React from 'react';
import { FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExportPDF = () => {
  const { toast } = useToast();

  const handlePrint = () => {
    // We use window.print() as a robust, native solution for PDF generation
    // instead of heavy external libraries like html2canvas/jspdf which are restricted.
    window.print();
    
    toast({
      title: "🖨️ Memulai Export",
      description: "Silakan pilih 'Save as PDF' pada dialog print browser Anda.",
      duration: 5000,
    });
  };

  return (
    <div className="mb-8 flex justify-end">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #root, #root * {
              visibility: visible;
            }
            #root {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            /* Hide non-printable elements */
            button, .no-print {
              display: none !important;
            }
            /* Ensure charts scale properly */
            .recharts-responsive-container {
              width: 100% !important;
            }
          }
        `}
      </style>
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg transition-all font-medium"
      >
        <FileDown size={20} />
        Export Laporan PDF
      </button>
    </div>
  );
};

export default ExportPDF;