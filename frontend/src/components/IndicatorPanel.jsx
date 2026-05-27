import React, { useMemo } from 'react'

export default function IndicatorPanel({ data }) {
  const latestData = useMemo(() => {
    if (!data?.data) return null
    const entries = Object.entries(data.data).sort((a, b) => a[0].localeCompare(b[0]))
    return entries.length > 0 ? entries[entries.length - 1][1] : null
  }, [data])

  if (!latestData) return null

  const formatNum = (n) => {
    if (n === 0 || n === undefined || n === null) return '—'
    return typeof n === 'number' ? n.toFixed(2) : n
  }

  const getRSIColor = (rsi) => {
    if (rsi > 70) return 'text-red-400'
    if (rsi < 30) return 'text-emerald-400'
    return 'text-gray-300'
  }

  const getStochColor = (k) => {
    if (k > 80) return 'text-red-400'
    if (k < 20) return 'text-emerald-400'
    return 'text-gray-300'
  }

  return (
    <div className="card h-full overflow-y-auto max-h-[560px]">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Current Indicators
      </h3>

      {/* Price Info */}
      <div className="mb-4 pb-3 border-b border-gray-700">
        <div className="text-2xl font-bold">{formatNum(latestData.Close)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">O: {formatNum(latestData.Open)}</span>
          <span className="text-xs text-gray-400">H: {formatNum(latestData.High)}</span>
          <span className="text-xs text-gray-400">L: {formatNum(latestData.Low)}</span>
        </div>
        {latestData.Volume > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Vol: {(latestData.Volume / 1e6).toFixed(2)}M
          </div>
        )}
      </div>

      {/* Trend */}
      <Section title="Trend">
        <Row label="SMA 20" value={formatNum(latestData.SMA_20)} />
        <Row label="SMA 50" value={formatNum(latestData.SMA_50)} />
        <Row label="SMA 200" value={formatNum(latestData.SMA_200)} />
        <Row label="EMA 9" value={formatNum(latestData.EMA_9)} />
        <Row label="EMA 21" value={formatNum(latestData.EMA_21)} />
        {latestData.ADX > 0 && (
          <Row label="ADX" value={formatNum(latestData.ADX)} extra={latestData.ADX > 25 ? '(Strong)' : '(Weak)'} />
        )}
      </Section>

      {/* MACD */}
      <Section title="MACD">
        <Row label="MACD" value={formatNum(latestData.MACD)} />
        <Row label="Signal" value={formatNum(latestData.MACD_Signal)} />
        <Row
          label="Histogram"
          value={formatNum(latestData.MACD_Histogram)}
          className={latestData.MACD_Histogram > 0 ? 'text-emerald-400' : 'text-red-400'}
        />
      </Section>

      {/* Momentum */}
      <Section title="Momentum">
        <Row
          label="RSI (14)"
          value={formatNum(latestData.RSI)}
          className={getRSIColor(latestData.RSI)}
          extra={latestData.RSI > 70 ? 'Overbought' : latestData.RSI < 30 ? 'Oversold' : ''}
        />
        <Row
          label="Stoch %K"
          value={formatNum(latestData.Stoch_K)}
          className={getStochColor(latestData.Stoch_K)}
        />
        <Row label="Stoch %D" value={formatNum(latestData.Stoch_D)} />
        <Row label="CCI (20)" value={formatNum(latestData.CCI)} />
      </Section>

      {/* Bollinger Bands */}
      <Section title="Bollinger Bands">
        <Row label="Upper" value={formatNum(latestData.BB_Upper)} />
        <Row label="Middle" value={formatNum(latestData.BB_Middle)} />
        <Row label="Lower" value={formatNum(latestData.BB_Lower)} />
      </Section>

      {/* Volatility */}
      <Section title="Volatility">
        <Row label="ATR (14)" value={formatNum(latestData.ATR)} />
      </Section>

      {/* Volume */}
      {latestData.OBV !== 0 && (
        <Section title="Volume">
          <Row label="OBV" value={(latestData.OBV / 1e6).toFixed(2) + 'M'} />
          <Row label="Vol SMA 20" value={latestData.Volume_SMA_20 ? (latestData.Volume_SMA_20 / 1e6).toFixed(2) + 'M' : '—'} />
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-3 pb-2 border-b border-gray-700/50">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function Row({ label, value, className = '', extra = '' }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={className || 'text-gray-200'}>
        {value}
        {extra && <span className="text-xs text-gray-500 ml-1">{extra}</span>}
      </span>
    </div>
  )
}
