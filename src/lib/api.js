import { mockData } from './mockData';

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TIMEOUT_MS = 3000; // Short timeout for demo purposes to fail fast to mocks
const RETRIES = 1;

/**
 * Fetch wrapper with timeout and fallback
 */
async function fetchWithFallback(endpoint, fallbackKey) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(id);
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    console.warn(`API Fetch failed for ${endpoint}. Using fallback mock data. Error: ${error.message}`);
    // Simulate network delay for mock
    await new Promise(r => setTimeout(r, 600)); 
    return mockData[fallbackKey];
  }
}

export const api = {
  async getMetrics() {
    return fetchWithFallback('/metrics', 'metrics');
  },

  async getHistorical() {
    return fetchWithFallback('/historical', 'historical');
  },

  async getPredictions() {
    return fetchWithFallback('/predictions', 'predictions');
  },

  async getPriceChanges() {
    return fetchWithFallback('/price-changes', 'priceChanges');
  },

  async getCommodities() {
    return fetchWithFallback('/commodities', 'commodities');
  }
};