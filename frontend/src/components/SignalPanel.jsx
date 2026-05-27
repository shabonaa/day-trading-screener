import React from 'react'

export default function SignalPanel({ signals, symbol, method, onRefresh }) {
  if (!signals) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-400">No signal data available. Click Analyze to generate signals.</p>
      </div>
    )
  }

  const methodLabels = {
    combined: 'Combined (Rules + ML)',
    rule_based: 'Rule-Based',
    ml_based: 'Machine Learning',
  }

  const rec = signals.current_recommendation

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Buy/Sell Signals — {symbol}
          <span className="text-sm text-gray-400 ml-2">Method: {methodLabels[method]}</span>
        </h2>
        <button onClick={onRefresh} className="btn-primary text-sm">
          🔄 Refresh
        </button>
      </div>

      {/* Current Recommendation */}
      <div className="card border-2 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Current Recommendation</div>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${
                rec?.action === 'BUY' ? 'text-emerald-400' :
                rec?.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {rec?.action === 'BUY' ? '🟢' : rec?.action === 'SELL' ? '🔴' : '🟡'} {rec?.action || 'HOLD'}
              </span>
              <span className="text-sm text-gray-400">
                Confidence: {rec?.confidence?.toFixed(1) || 0}%
              </span>
            </div>
          </div>
          
          {/* Sub-recommendations for combined */}
          {rec?.rule_based && rec?.ml_based && (
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Rules</div>
                <div className={`text-sm font-semibold ${
                  rec.rule_based.action === 'BUY' ? 'text-emerald-400' :
                  rec.rule_based.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {rec.rule_based.action}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">ML</div>
                <div className={`text-sm font-semibold ${
                  rec.ml_based.action === 'BUY' ? 'text-emerald-400' :
                  rec.ml_based.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {rec.ml_based.action}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Agreement</div>
                <div className={`text-sm font-semibold ${
                  rec.agreement === 'YES' ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {rec.agreement}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signal History */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400">
            Recent Signals ({signals.total_signals || 0} total)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b border-gray-700">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-right py-2 px-2">Price</th>
                <th className="text-right py-2 px-2">Strength</th>
                <th className="text-left py-2 px-2">Reasons</th>
                {method === 'combined' && <th className="text-left py-2 px-2">Source</th>}
              </tr>
            </thead>
            <tbody>
              {(signals.signals || []).slice(-20).reverse().map((sig, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-2 px-2 text-gray-300 text-xs">
                    {sig.date?.split(' ')[0]}
                  </td>
                  <td className="py-2 px-2">
                    <span className={sig.type === 'BUY' ? 'badge-bullish' : 'badge-bearish'}>
                      {sig.type === 'BUY' ? '▲' : '▼'} {sig.type}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right text-gray-200 font-mono">
                    ${sig.price?.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${sig.type === 'BUY' ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${(sig.strength || sig.combined_strength || 0.5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {((sig.strength || sig.combined_strength || 0.5) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-xs text-gray-400 max-w-xs truncate">
                    {(sig.reasons || []).join(', ')}
                  </td>
                  {method === 'combined' && (
                    <td className="py-2 px-2 text-xs text-gray-500">
                      {sig.source === 'ml_based' ? '🤖 ML' : '📏 Rules'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!signals.signals || signals.signals.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            No signals generated for this period. Try a longer timeframe.
          </div>
        )}
      </div>
    </div>
  )
}
