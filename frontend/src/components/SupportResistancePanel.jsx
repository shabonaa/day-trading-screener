import React from 'react'

export default function SupportResistancePanel({ levels, currentPrice }) {
  if (!levels) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-400">No support/resistance data available.</p>
      </div>
    )
  }

  const price = currentPrice || 0

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Support & Resistance Levels</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price Action Levels */}
        <div className="card">
          <h3 className="text-sm font-semibold text-amber-400 uppercase mb-3">
            📊 Price Action (Swing Points)
          </h3>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-semibold">Resistance</div>
            {(levels.price_action?.resistance || []).reverse().map((level, i) => (
              <LevelRow key={`r-${i}`} level={level} currentPrice={price} type="resistance" />
            ))}
            
            <div className="my-2 py-1 px-2 bg-blue-900/30 rounded text-center text-sm font-mono text-blue-300">
              Current: ${price?.toFixed(2)}
            </div>
            
            <div className="text-xs text-gray-500 font-semibold">Support</div>
            {(levels.price_action?.support || []).reverse().map((level, i) => (
              <LevelRow key={`s-${i}`} level={level} currentPrice={price} type="support" />
            ))}
            
            {(!levels.price_action?.resistance?.length && !levels.price_action?.support?.length) && (
              <p className="text-xs text-gray-500">Insufficient data for detection</p>
            )}
          </div>
        </div>

        {/* Fibonacci Levels */}
        <div className="card">
          <h3 className="text-sm font-semibold text-purple-400 uppercase mb-3">
            🌀 Fibonacci Retracement
          </h3>
          {levels.fibonacci?.levels && Object.keys(levels.fibonacci.levels).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(levels.fibonacci.levels).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-mono ${
                    Math.abs(value - price) / price < 0.01 ? 'text-yellow-400 font-bold' : 'text-gray-200'
                  }`}>
                    ${value?.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500">
                Range: ${levels.fibonacci.low?.toFixed(2)} — ${levels.fibonacci.high?.toFixed(2)}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Insufficient data</p>
          )}
        </div>

        {/* Pivot Points */}
        <div className="card">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase mb-3">
            📐 Pivot Points
          </h3>
          {levels.pivot_points ? (
            <div className="space-y-1">
              <PivotRow label="R3" value={levels.pivot_points.r3} price={price} type="resistance" />
              <PivotRow label="R2" value={levels.pivot_points.r2} price={price} type="resistance" />
              <PivotRow label="R1" value={levels.pivot_points.r1} price={price} type="resistance" />
              <div className="my-2 py-1 px-2 bg-gray-700 rounded text-center">
                <span className="text-xs text-gray-400">Pivot: </span>
                <span className="text-sm font-mono text-white">${levels.pivot_points.pivot?.toFixed(2)}</span>
              </div>
              <PivotRow label="S1" value={levels.pivot_points.s1} price={price} type="support" />
              <PivotRow label="S2" value={levels.pivot_points.s2} price={price} type="support" />
              <PivotRow label="S3" value={levels.pivot_points.s3} price={price} type="support" />
            </div>
          ) : (
            <p className="text-xs text-gray-500">Insufficient data</p>
          )}
        </div>

        {/* Volume Profile */}
        <div className="card">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase mb-3">
            📊 Volume Profile
          </h3>
          {levels.volume_profile && levels.volume_profile.poc > 0 ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Point of Control (POC)</div>
                <div className="text-lg font-mono font-bold text-cyan-300">
                  ${levels.volume_profile.poc?.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  {levels.volume_profile.poc > price ? 'Above current price (resistance)' : 'Below current price (support)'}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Value Area (70% volume)</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">High:</span>
                  <span className="font-mono text-gray-200">${levels.volume_profile.value_area_high?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Low:</span>
                  <span className="font-mono text-gray-200">${levels.volume_profile.value_area_low?.toFixed(2)}</span>
                </div>
              </div>

              {/* Visual representation */}
              <div className="mt-3 relative h-24 bg-gray-700/50 rounded">
                <div className="absolute inset-x-0 text-center text-xs text-gray-500 top-1">
                  VA High: ${levels.volume_profile.value_area_high?.toFixed(2)}
                </div>
                <div
                  className="absolute inset-x-2 bg-cyan-900/50 border border-cyan-700 rounded"
                  style={{
                    top: '20%',
                    bottom: '20%',
                  }}
                >
                  <div className="absolute inset-x-0 text-center text-xs text-cyan-300 top-1/2 -translate-y-1/2">
                    POC: ${levels.volume_profile.poc?.toFixed(2)}
                  </div>
                </div>
                <div className="absolute inset-x-0 text-center text-xs text-gray-500 bottom-1">
                  VA Low: ${levels.volume_profile.value_area_low?.toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">No volume data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

function LevelRow({ level, currentPrice, type }) {
  const distance = currentPrice > 0 ? ((level - currentPrice) / currentPrice * 100).toFixed(1) : 0
  
  return (
    <div className="flex justify-between items-center text-sm py-0.5">
      <span className="font-mono text-gray-200">${level?.toFixed(2)}</span>
      <span className={`text-xs ${type === 'resistance' ? 'text-red-400' : 'text-emerald-400'}`}>
        {distance > 0 ? '+' : ''}{distance}%
      </span>
    </div>
  )
}

function PivotRow({ label, value, price, type }) {
  const distance = price > 0 ? ((value - price) / price * 100).toFixed(1) : 0
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={`font-semibold ${type === 'resistance' ? 'text-red-400' : 'text-emerald-400'}`}>
        {label}
      </span>
      <span className="font-mono text-gray-200">${value?.toFixed(2)}</span>
      <span className="text-xs text-gray-500">{distance > 0 ? '+' : ''}{distance}%</span>
    </div>
  )
}
