import React, { useEffect, useRef, useMemo } from 'react'
import { createChart } from 'lightweight-charts'

const INDICATOR_COLORS = {
  SMA_20: '#f59e0b',
  SMA_50: '#3b82f6',
  SMA_200: '#8b5cf6',
  EMA_9: '#10b981',
  EMA_21: '#ec4899',
  EMA_55: '#06b6d4',
  BB_Upper: 'rgba(99, 102, 241, 0.6)',
  BB_Middle: 'rgba(99, 102, 241, 0.3)',
  BB_Lower: 'rgba(99, 102, 241, 0.6)',
  VWAP: '#f97316',
}

export default function StockChart({ data, chartType, selectedIndicators, signals }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)

  const chartData = useMemo(() => {
    if (!data?.data) return { candles: [], lines: {}, volume: [] }

    const entries = Object.entries(data.data).sort((a, b) => a[0].localeCompare(b[0]))
    
    const candles = []
    const volume = []
    const lines = {}

    // Initialize line arrays for selected indicators
    selectedIndicators.forEach(ind => { lines[ind] = [] })

    entries.forEach(([dateStr, row]) => {
      const time = dateStr.includes(' ')
        ? Math.floor(new Date(dateStr).getTime() / 1000)
        : dateStr

      const candle = {
        time,
        open: row.Open,
        high: row.High,
        low: row.Low,
        close: row.Close,
      }
      candles.push(candle)

      volume.push({
        time,
        value: row.Volume || 0,
        color: row.Close >= row.Open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
      })

      // Indicator lines
      selectedIndicators.forEach(ind => {
        if (row[ind] && row[ind] !== 0) {
          lines[ind].push({ time, value: row[ind] })
        }
      })
    })

    return { candles, lines, volume }
  }, [data, selectedIndicators])

  const signalMarkers = useMemo(() => {
    if (!signals?.signals || !chartData.candles.length) return []

    const markers = []
    signals.signals.slice(-30).forEach(sig => {
      const time = sig.date.includes(' ')
        ? Math.floor(new Date(sig.date).getTime() / 1000)
        : sig.date

      markers.push({
        time,
        position: sig.type === 'BUY' ? 'belowBar' : 'aboveBar',
        color: sig.type === 'BUY' ? '#26a69a' : '#ef5350',
        shape: sig.type === 'BUY' ? 'arrowUp' : 'arrowDown',
        text: sig.type,
      })
    })

    return markers.sort((a, b) => {
      if (typeof a.time === 'string') return a.time.localeCompare(b.time)
      return a.time - b.time
    })
  }, [signals, chartData])

  useEffect(() => {
    if (!chartContainerRef.current || !chartData.candles.length) return

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a2e' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(55, 65, 81, 0.5)' },
        horzLines: { color: 'rgba(55, 65, 81, 0.5)' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    })

    chartRef.current = chart

    // Main series
    let mainSeries
    if (chartType === 'candlestick') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
      })
    } else {
      mainSeries = chart.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
      })
    }

    if (chartType === 'candlestick') {
      mainSeries.setData(chartData.candles)
    } else {
      mainSeries.setData(chartData.candles.map(c => ({ time: c.time, value: c.close })))
    }

    // Add signal markers
    if (signalMarkers.length > 0) {
      mainSeries.setMarkers(signalMarkers)
    }

    // Add indicator lines
    Object.entries(chartData.lines).forEach(([name, lineData]) => {
      if (lineData.length > 0) {
        const lineSeries = chart.addLineSeries({
          color: INDICATOR_COLORS[name] || '#9ca3af',
          lineWidth: 1,
          title: name,
          lastValueVisible: false,
          priceLineVisible: false,
        })
        lineSeries.setData(lineData)
      }
    })

    // Volume
    if (chartData.volume.length > 0) {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      })
      volumeSeries.setData(chartData.volume)
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      })
    }

    // Fit content
    chart.timeScale().fitContent()

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [chartData, chartType, signalMarkers])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">
          {data?.info?.name || data?.symbol}
          <span className="text-sm text-gray-400 ml-2">
            {data?.info?.exchange} • {data?.info?.currency}
          </span>
        </h3>
        {selectedIndicators.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedIndicators.map(ind => (
              <span
                key={ind}
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: `${INDICATOR_COLORS[ind]}20`, color: INDICATOR_COLORS[ind] }}
              >
                {ind}
              </span>
            ))}
          </div>
        )}
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}
