import axios from 'axios'

const API_BASE = '/api'

export async function fetchStockData(symbol, period = '6mo', interval = '1d') {
  const response = await axios.get(`${API_BASE}/stock/${symbol}`, {
    params: { period, interval }
  })
  return response.data
}

export async function uploadCSV(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function fetchPrediction(symbol, period = '1y', interval = '1d', horizon = 'next_day') {
  const response = await axios.post(`${API_BASE}/predict`, {
    symbol, period, interval, horizon
  })
  return response.data
}

export async function fetchSignals(symbol, period = '6mo', interval = '1d', method = 'combined') {
  const response = await axios.post(`${API_BASE}/signals`, {
    symbol, period, interval, method
  })
  return response.data
}

export async function searchSymbol(query) {
  const response = await axios.get(`${API_BASE}/search/${query}`)
  return response.data
}
