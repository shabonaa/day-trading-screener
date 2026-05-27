import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import StockChart from './components/StockChart'
import IndicatorPanel from './components/IndicatorPanel'
import PredictionPanel from './components/PredictionPanel'
import SignalPanel from './components/SignalPanel'
import SupportResistancePanel from './components/SupportResistancePanel'
import ControlPanel from './components/ControlPanel'
import { fetchStockData, uploadCSV, fetchPrediction, fetchSignals } from './utils/api'

function App() {
  const [stockData, setStockData] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [signals, setSignals] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [symbol, setSymbol] = useState('')
  const [chartType, setChartType] = useState('candlestick')
  const [interval, setInterval] = useState('1d')
  const [period, setPeriod] = useState('6mo')
  const [selectedIndicators, setSelectedIndicators] = useState([
    'SMA_20', 'SMA_50', 'EMA_9', 'EMA_21', 'BB_Upper', 'BB_Lower'
  ])
  const [predictionHorizon, setPredictionHorizon] = useState('next_day')
  const [signalMethod, setSignalMethod] = useState('combined')
  const [activeTab, setActiveTab] = useState('chart')

  const handleSearch = useCallback(async (sym) => {
    if (!sym) return
    setLoading(true)
    setError(null)
    setSymbol(sym.toUpperCase())
    
    try {
      const data = await fetchStockData(sym, period, interval)
      setStockData(data)
      
      // Fetch predictions and signals in parallel
      const [pred, sigs] = await Promise.all([
        fetchPrediction(sym, period, interval, predictionHorizon).catch(() => null),
        fetchSignals(sym, period, interval, signalMethod).catch(() => null),
      ])
      setPrediction(pred)
      setSignals(sigs)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch data')
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }, [period, interval, predictionHorizon, signalMethod])

  const handleUpload = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await uploadCSV(file)
      setStockData(data)
      setSymbol(data.symbol || file.name)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefreshPrediction = useCallback(async () => {
    if (!symbol) return
    try {
      const pred = await fetchPrediction(symbol, '1y', interval, predictionHorizon)
      setPrediction(pred)
    } catch (err) {
      console.error('Prediction error:', err)
    }
  }, [symbol, interval, predictionHorizon])

  const handleRefreshSignals = useCallback(async () => {
    if (!symbol) return
    try {
      const sigs = await fetchSignals(symbol, period, interval, signalMethod)
      setSignals(sigs)
    } catch (err) {
      console.error('Signals error:', err)
    }
  }, [symbol, period, interval, signalMethod])

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-[1920px] mx-auto px-4 py-4">
        {/* Control Panel */}
        <ControlPanel
          symbol={symbol}
          onSearch={handleSearch}
          onUpload={handleUpload}
          chartType={chartType}
          setChartType={setChartType}
          interval={interval}
          setInterval={setInterval}
          period={period}
          setPeriod={setPeriod}
          selectedIndicators={selectedIndicators}
          setSelectedIndicators={setSelectedIndicators}
          predictionHorizon={predictionHorizon}
          setPredictionHorizon={setPredictionHorizon}
          signalMethod={signalMethod}
          setSignalMethod={setSignalMethod}
          loading={loading}
        />

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-400">Analyzing {symbol}...</span>
          </div>
        )}

        {/* Main Content */}
        {stockData && !loading && (
          <div className="mt-4 space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
              {[
                { id: 'chart', label: 'Chart & Indicators' },
                { id: 'prediction', label: 'AI Prediction' },
                { id: 'signals', label: 'Buy/Sell Signals' },
                { id: 'levels', label: 'Support & Resistance' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chart Tab */}
            {activeTab === 'chart' && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                <div className="xl:col-span-3">
                  <StockChart
                    data={stockData}
                    chartType={chartType}
                    selectedIndicators={selectedIndicators}
                    signals={signals}
                  />
                </div>
                <div className="xl:col-span-1">
                  <IndicatorPanel data={stockData} />
                </div>
              </div>
            )}

            {/* Prediction Tab */}
            {activeTab === 'prediction' && (
              <PredictionPanel
                prediction={prediction}
                symbol={symbol}
                horizon={predictionHorizon}
                onRefresh={handleRefreshPrediction}
              />
            )}

            {/* Signals Tab */}
            {activeTab === 'signals' && (
              <SignalPanel
                signals={signals}
                symbol={symbol}
                method={signalMethod}
                onRefresh={handleRefreshSignals}
              />
            )}

            {/* Support & Resistance Tab */}
            {activeTab === 'levels' && (
              <SupportResistancePanel
                levels={stockData.support_resistance}
                currentPrice={Object.values(stockData.data).pop()?.Close}
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {!stockData && !loading && !error && (
          <div className="mt-16 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Stock Analysis Pro</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a stock symbol (e.g., AAPL, TSLA, MSFT) or upload a CSV file to get started with comprehensive technical analysis, AI predictions, and buy/sell signals.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
