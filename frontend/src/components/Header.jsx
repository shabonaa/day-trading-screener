import React from 'react'

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📊</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Stock Analysis Pro
          </h1>
        </div>
        <div className="text-sm text-gray-400">
          AI-Powered Technical Analysis & Predictions
        </div>
      </div>
    </header>
  )
}
