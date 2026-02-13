/**
 * Calculates the trend direction based on recent data points
 * @param {Array} data - Array of price objects
 * @returns {String} 'Naik', 'Turun', or 'Stabil'
 */
export const calculateTrendDirection = (data) => {
  if (!data || data.length < 2) return 'Stabil';
  
  const prices = data.map(d => d.price);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const diffPercent = ((last - first) / first) * 100;

  if (diffPercent > 2) return 'Naik';
  if (diffPercent < -2) return 'Turun';
  return 'Stabil';
};

/**
 * Calculates volatility (Standard Deviation)
 * @param {Array} data - Array of price objects
 * @returns {Number} Standard deviation
 */
export const calculateVolatility = (data) => {
  if (!data || data.length === 0) return 0;
  
  const prices = data.map(d => d.price);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const squareDiffs = prices.map(price => Math.pow(price - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / prices.length;
  
  return Math.sqrt(avgSquareDiff);
};

/**
 * Generate simple AI insights based on data
 * @param {Array} predictions 
 * @param {Object} metrics 
 */
export const generateAIInsights = (predictions, metrics) => {
  const trend = calculateTrendDirection(predictions);
  const volatility = calculateVolatility(predictions);
  const volatilityLevel = volatility > 1000 ? 'Tinggi' : volatility > 500 ? 'Sedang' : 'Rendah';
  
  let recommendation = 'Hold';
  let confidence = metrics?.r2_score ? Math.round(metrics.r2_score * 100) : 85;
  
  if (trend === 'Naik' && volatilityLevel !== 'Tinggi') recommendation = 'Beli';
  else if (trend === 'Turun') recommendation = 'Jual';

  return {
    trend,
    volatility: volatilityLevel,
    recommendation,
    confidence,
    points: [
      `Tren harga diprediksi ${trend.toLowerCase()} dalam 12 bulan ke depan.`,
      `Tingkat volatilitas pasar terpantau ${volatilityLevel.toLowerCase()}.`,
      `Model memiliki tingkat kepercayaan ${confidence}% berdasarkan data historis.`,
      `Disarankan untuk ${recommendation === 'Beli' ? 'melakukan akumulasi' : recommendation === 'Jual' ? 'mengurangi posisi' : 'menunggu konfirmasi pasar'}.`
    ]
  };
};