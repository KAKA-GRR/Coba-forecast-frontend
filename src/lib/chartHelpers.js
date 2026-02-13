export const normalizeDataForComparison = (data, keys) => {
  if (!data || data.length === 0) return [];
  
  // Normalize to base 100 based on the first entry
  const firstEntry = data[0];
  
  return data.map(item => {
    const normalizedItem = { date: item.date };
    keys.forEach(key => {
      if (item[key] !== undefined && firstEntry[key] !== 0) {
        normalizedItem[key] = (item[key] / firstEntry[key]) * 100;
      }
    });
    return normalizedItem;
  });
};

export const filterDataByRange = (data, range) => {
  if (!data || !range.start || !range.end) return data;
  
  const start = new Date(range.start);
  const end = new Date(range.end);
  
  return data.filter(item => {
    const d = new Date(item.date);
    return d >= start && d <= end;
  });
};