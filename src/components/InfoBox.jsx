import React from 'react'

const styles = {
  definitie: {
    icon: '📖',
    border: 'border-l-4 border-l-blue-500',
    bg: 'bg-blue-50/40',
  },
  verdieping: {
    icon: '📖',
    border: 'border-l-4 border-l-slate-400',
    bg: 'bg-slate-50',
  },
  vwo: {
    icon: '🚀',
    border: 'border-l-4 border-l-purple-500',
    bg: 'bg-purple-50/40',
  },
  juridisch: {
    icon: '⚖️',
    border: 'border-l-4 border-l-docent',
    bg: 'bg-red-50/40',
  },
}

export default function InfoBox({ type = 'definitie', title, children }) {
  const s = styles[type] || styles.definitie
  return (
    <div className={`mb-6 rounded-lg border border-border ${s.border} ${s.bg} p-5 lg:p-6`}>
      {title && (
        <h3 className="mb-2 text-slate-900">
          {s.icon} {title}
        </h3>
      )}
      <div className="space-y-3 text-slate-700">{children}</div>
    </div>
  )
}
