import type { FC } from 'react'
import React from 'react'

export interface IHeaderProps {
  title?: string
}

const Header: FC<IHeaderProps> = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: HKUST Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#003366] text-[#C99700] font-black flex items-center justify-center text-sm shadow-sm tracking-tighter">
            UST
          </div>
          <div>
            <div className="font-bold text-sm text-[#003366] leading-tight">
              HKUST Academic Advisory AI
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Official Regulations & Course Navigator
            </div>
          </div>
        </div>

        {/* Right Side: University Links & Status Badge */}
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified RAG Engine
          </span>
          <a
            href="https://registry.hkust.edu.hk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-[#003366] font-medium transition-colors"
          >
            Registry ↗
          </a>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)
