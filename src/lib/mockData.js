const generateHistoricalData = () => {
  const data = [];
  const startDate = new Date('2021-02-01');
  const endDate = new Date('2026-02-01');
  
  let currentPrice = 16200;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const volatility = (Math.random() - 0.5) * 2000;
    const trend = 100;
    currentPrice = Math.max(15000, Math.min(35000, currentPrice + trend + volatility));
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      price: Math.round(currentPrice)
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return data;
};

const generatePredictions = () => {
  const predictions = [];
  const startDate = new Date('2026-03-01');
  let currentPrice = 23400; 
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const volatility = (Math.random() - 0.45) * 800;
    currentPrice += 150 + volatility;
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice)
    });
  }
  
  return predictions;
};

const calculatePriceChanges = (predictions) => {
  const changes = [];
  for (let i = 0; i < predictions.length; i++) {
    const current = predictions[i];
    const previous = i === 0 ? { price: 23400 } : predictions[i - 1];
    
    const changeUSD = current.price - previous.price;
    const changePercent = ((changeUSD / previous.price) * 100).toFixed(2);
    
    changes.push({
      month: current.date,
      previousPrice: previous.price,
      currentPrice: current.price,
      changeUSD: changeUSD,
      changePercent: parseFloat(changePercent)
    });
  }
  return changes;
};

const generateCommoditiesData = () => {
  const data = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-02-01');
  let currentDate = new Date(startDate);

  let nikel = 21000;
  let emas = 1950;
  let batubara = 140;

  while (currentDate <= endDate) {
    nikel += (Math.random() - 0.5) * 1000;
    emas += (Math.random() - 0.4) * 50;
    batubara += (Math.random() - 0.5) * 10;

    data.push({
      date: currentDate.toISOString().split('T')[0],
      nikel: Math.round(nikel),
      emas: Math.round(emas),
      batubara: Math.round(batubara)
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return data;
};

export const mockData = {
  historical: generateHistoricalData(),
  predictions: generatePredictions(),
  commodities: generateCommoditiesData(),
  metrics: {
    mape: 4.23,
    rmse: 1247.56,
    r2_score: 0.9312,
    data_points: 48
  }
};

mockData.priceChanges = calculatePriceChanges(mockData.predictions);