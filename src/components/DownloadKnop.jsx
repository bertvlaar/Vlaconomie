import React from 'react'

export default function DownloadKnop({ href, children, size = 'normal' }) {
  return (
    <div className={size === 'large' ? 'mt-4 text-center' : 'mt-8 text-center'}>
      <a
        href={href}
        className={
          size === 'large'
            ? 'inline-flex items-center gap-2 rounded-lg bg-action px-8 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-blue-700'
            : 'inline-flex items-center gap-2 rounded-lg bg-action px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700'
        }
      >
        📥 {children}
      </a>
    </div>
  )
}
