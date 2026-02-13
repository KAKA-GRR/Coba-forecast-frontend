import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Save, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    apiEndpoint: 'http://localhost:5000/api',
    enableAutoRefresh: true,
    refreshInterval: 15,
    enableNotifications: true,
    theme: 'light'
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Pengaturan Disimpan",
      description: "Konfigurasi aplikasi telah diperbarui.",
    });
  };

  const handleReset = () => {
    const defaults = {
      apiEndpoint: 'http://localhost:5000/api',
      enableAutoRefresh: true,
      refreshInterval: 15,
      enableNotifications: true,
      theme: 'light'
    };
    setSettings(defaults);
    localStorage.setItem('appSettings', JSON.stringify(defaults));
    toast({
      title: "Reset Berhasil",
      description: "Pengaturan dikembalikan ke default.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Pengaturan - Prediksi Harga Nikel</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Header />
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">⚙️ Konfigurasi Aplikasi</h2>
            
            <div className="space-y-6">
              {/* API Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Koneksi Backend</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">API Endpoint URL</label>
                    <input 
                      type="text" 
                      name="apiEndpoint"
                      value={settings.apiEndpoint}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="http://localhost:5000/api"
                    />
                    <p className="text-xs text-gray-400 mt-1">Alamat server Flask yang menjalankan model GRU.</p>
                  </div>
                </div>
              </section>

              {/* Preferences Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Preferensi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Auto Refresh</label>
                      <p className="text-xs text-gray-400">Perbarui data secara otomatis saat dashboard dibuka.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="enableAutoRefresh"
                      checked={settings.enableAutoRefresh}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>

                  {settings.enableAutoRefresh && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Interval Refresh (Menit)</label>
                      <select 
                        name="refreshInterval"
                        value={settings.refreshInterval}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="15">15 Menit</option>
                        <option value="30">30 Menit</option>
                        <option value="60">1 Jam</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Notifikasi</label>
                      <p className="text-xs text-gray-400">Tampilkan toast notification untuk status sistem.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="enableNotifications"
                      checked={settings.enableNotifications}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="pt-6 border-t flex gap-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                >
                  <Save size={18} /> Simpan Pengaturan
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <RotateCcw size={18} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;