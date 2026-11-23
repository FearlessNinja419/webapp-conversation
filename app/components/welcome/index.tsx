import type { FC } from 'react'
import React from 'react'

export interface IWelcomeProps {
  onSelectPrompt?: (prompt: string) => void
}

const Welcome: FC<IWelcomeProps> = ({ onSelectPrompt }) => {
  const sampleQuestions = [
    {
      category: 'Course Requirements',
      question: 'What is the passing grade for MATH 1003 / 1013?',
    },
    {
      category: 'Major Declaration',
      question: 'What are the prerequisites to declare an IS major in SBM?',
    },
    {
      category: 'Regulations',
      question: 'What is the maximum credit overload permitted per semester?',
    },
    {
      category: 'Procedures',
      question: 'How do I submit an academic petition for credit transfer?',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-4 py-8 text-center">
      {/* HKUST Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#F8F1E0] border border-[#C99700]/30 text-[#003366] text-xs font-semibold tracking-wide uppercase">
        <span className="w-2 h-2 rounded-full bg-[#C99700]"></span>
        Official Academic Knowledge Portal
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003366] tracking-tight mb-2">
        HKUST Academic Advisory AI
      </h1>

      {/* Subtitle */}
      <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
        Ask questions regarding undergraduate policies, program catalogs, course prerequisites, and administrative deadlines directly from official university sources.
      </p>

      {/* Starter Question Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {sampleQuestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt && onSelectPrompt(item.question)}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#003366] hover:shadow-md transition-all duration-150 text-left group cursor-pointer"
          >
            <div className="text-[11px] font-semibold text-[#C99700] uppercase tracking-wider mb-1">
              {item.category}
            </div>
            <div className="text-sm font-medium text-slate-800 group-hover:text-[#003366]">
              "{item.question}"
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Welcome)
