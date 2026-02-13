export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (num) => {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};