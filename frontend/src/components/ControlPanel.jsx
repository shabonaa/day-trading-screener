import React, { useState, useRef } from 'react'

const INDICATORS = [
  { id: 'SMA_20', label: 'SMA 20', group: 'Trend' },
  { id: 'SMA_50', label: 'SMA 50', group: 'Trend' },
  { id: 'SMA_200', label: 'SMA 200', group: 'Trend' },
  { id: 'EMA_9', label: 'EMA 9', group: 'Trend' },
  { id: 'EMA_21', label: 'EMA 21', group: 'Trend' },
  { id: 'EMA_55', label: 'EMA 55', group: 'Trend' },
  { id: 'BB_Upper', label: 'Bollinger Upper', group: 'Volatility' },
  { id: 'BB_Lower', label: 'Bollinger Lower', group: 'Volatility' },
  { id: 'BB_Middle', label: 'Bollinger Middle', group: 'Volatility' },
  { id: 'VWAP', label: 'VWAP', group: 'Volume' },
]

const INTERVALS = [
  { value: '15m', label: '15min' },
  { value: '30m', label: '30min' },
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' },
  { value: '1wk', label: '1W' },
]

const PERIODS = [
  { value: '1d', label: '1 Day' },
  { value: '5d', label: '5 Days' },
  { value: '1mo', label: '1 Month' },
  { value: '3mo', label: '3 Months' },
  { value: '6mo', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
]

export default function ControlPanel({
  symbol,
  onSearch,
  onUpload,
  chartType,
  setChartType,
  interval,
  setInterval,
  period,
  setPeriod,
  selectedIndicators,
  setSelectedIndicators,
  predictionHorizon,
  setPredictionHorizon,
  signalMethod,
  setSignalMethod,
  loading,
}) {
  const [searchInput, setSearchInput] = useState(symbol || '')
  const [showIndicators, setShowIndicators] = useState(false)
  const fileRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput.trim())
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
      e.target.value = ''
    }
  }

  const toggleIndicator = (id) => {
    setSelectedIndicators(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter symbol (e.g., AAPL)"
            className="input-field w-48"
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '...' : 'Analyze'}
          </button>
        </form>

        {/* Upload */}
        <button
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          disabled={loading}
        >
          📁 Upload CSV
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600"></div>

        {/* Chart Type */}
        <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => setChartType('candlestick')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Candlestick
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Line
          </button>
        </div>

        {/* Interval */}
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="select-field text-sm"
        >
          {INTERVALS.map(i => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </select>

        {/* Period */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="select-field text-sm"
        >
          {PERIODS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Prediction Horizon */}
        <select
          value={predictionHorizon}
          onChange={(e) => setPredictionHorizon(e.target.value)}
          className="select-field text-sm"
        >
          <option value="next_candle">Day Trade</option>
          <option value="next_day">Next Day</option>
          <option value="next_week">Next Week</option>
        </select>

        {/* Signal Method */}
        <select
          value={signalMethod}
          onChange={(e) => setSignalMethod(e.target.value)}
          className="select-field text-sm"
        >
          <option value="combined">Combined Signals</option>
          <option value="rule_based">Rule-Based Only</option>
          <option value="ml_based">ML-Based Only</option>
        </select>

        {/* Indicators Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors"
          >
            📉 Indicators ({selectedIndicators.length})
          </button>
          
          {showIndicators && (
            <div className="absolute top-full mt-2 right-0 z-50 bg-gray-800 border border-gray-600 rounded-lg p-3 w-64 shadow-xl">
              <div className="text-xs font-semibold text-gray-400 mb-2">Overlay Indicators</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {INDICATORS.map(ind => (
                  <label key={ind.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-700 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedIndicators.includes(ind.id)}
                      onChange={() => toggleIndicator(ind.id)}
                      className="rounded border-gray-500"
                    />
                    <span>{ind.label}</span>
                    <span className="text-xs text-gray-500 ml-auto">{ind.group}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setShowIndicators(false)}
                className="mt-2 w-full text-xs text-center text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
