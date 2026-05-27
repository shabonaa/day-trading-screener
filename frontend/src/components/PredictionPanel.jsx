import React from 'react'

export default function PredictionPanel({ prediction, symbol, horizon, onRefresh }) {
  if (!prediction) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-400">No prediction data available. Click Analyze to generate predictions.</p>
      </div>
    )
  }

  const horizonLabels = {
    next_candle: 'Day Trading (Next Candle)',
    next_day: 'Next Day',
    next_week: 'Next Week',
  }

  const getDirectionBadge = (direction) => {
    if (direction === 'BULLISH') return 'badge-bullish'
    if (direction === 'BEARISH') return 'badge-bearish'
    return 'badge-neutral'
  }

  const getDirectionIcon = (direction) => {
    if (direction === 'BULLISH') return '🟢'
    if (direction === 'BEARISH') return '🔴'
    return '⚪'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          AI Prediction — {symbol}
          <span className="text-sm text-gray-400 ml-2">Horizon: {horizonLabels[horizon]}</span>
        </h2>
        <button onClick={onRefresh} className="btn-primary text-sm">
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Combined Prediction */}
        <div className="card border-2 border-blue-600">
          <div className="text-xs text-blue-400 uppercase font-semibold mb-2">Combined Prediction</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{getDirectionIcon(prediction.combined?.direction)}</span>
            <div>
              <div className={`text-xl font-bold ${
                prediction.combined?.direction === 'BULLISH' ? 'text-emerald-400' :
                prediction.combined?.direction === 'BEARISH' ? 'text-red-400' : 'text-gray-300'
              }`}>
                {prediction.combined?.direction}
              </div>
              <div className="text-sm text-gray-400">
                Confidence: {prediction.combined?.confidence}%
              </div>
            </div>
          </div>
          {prediction.combined?.reasoning && (
            <p className="text-xs text-gray-400 mt-2">{prediction.combined.reasoning}</p>
          )}
          {prediction.combined?.agreement && (
            <div className="mt-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                prediction.combined.agreement === 'AGREE' ? 'bg-emerald-900 text-emerald-300' : 'bg-yellow-900 text-yellow-300'
              }`}>
                Models {prediction.combined.agreement}
              </span>
            </div>
          )}
          <div className="mt-3 text-xs text-gray-500">
            Current Price: ${prediction.current_price}
          </div>
        </div>

        {/* Rule-Based */}
        <div className="card">
          <div className="text-xs text-amber-400 uppercase font-semibold mb-2">Rule-Based Analysis</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getDirectionIcon(prediction.rule_based?.direction)}</span>
            <div>
              <div className="text-lg font-bold">{prediction.rule_based?.direction}</div>
              <div className="text-sm text-gray-400">
                Confidence: {prediction.rule_based?.confidence}%
              </div>
            </div>
          </div>
          
          {/* Signal breakdown */}
          {prediction.rule_based?.signals && (
            <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
              <div className="text-xs text-gray-500 font-semibold">Signals:</div>
              {prediction.rule_based.signals.map((sig, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{sig.reason}</span>
                  <span className={sig.weight > 0 ? 'text-emerald-400' : sig.weight < 0 ? 'text-red-400' : 'text-gray-400'}>
                    {sig.weight > 0 ? '+' : ''}{sig.weight.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ML-Based */}
        <div className="card">
          <div className="text-xs text-purple-400 uppercase font-semibold mb-2">Machine Learning</div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getDirectionIcon(prediction.ml_based?.direction)}</span>
            <div>
              <div className="text-lg font-bold">{prediction.ml_based?.direction}</div>
              <div className="text-sm text-gray-400">
                Confidence: {prediction.ml_based?.confidence}%
              </div>
            </div>
          </div>

          {prediction.ml_based?.probabilities && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400">Up: {prediction.ml_based.probabilities.up}%</span>
                <span className="text-red-400">Down: {prediction.ml_based.probabilities.down}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${prediction.ml_based.probabilities.up}%` }}
                ></div>
              </div>
            </div>
          )}

          {prediction.ml_based?.cv_accuracy && (
            <div className="mt-2 text-xs text-gray-400">
              CV Accuracy: {prediction.ml_based.cv_accuracy}%
            </div>
          )}

          {prediction.ml_based?.model && (
            <div className="mt-1 text-xs text-gray-500">
              Model: {prediction.ml_based.model}
            </div>
          )}

          {prediction.ml_based?.top_features && (
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500 font-semibold">Top Features:</div>
              {prediction.ml_based.top_features.slice(0, 5).map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{f.feature}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${f.importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 w-8">{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
