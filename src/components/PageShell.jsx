import React from 'react'

export default function PageShell({ children, tint = false }) {
  return (
    <div className={tint ? 'min-h-screen bg-docentbg' : 'min-h-screen bg-pagebg'}>
      <main className="mx-auto max-w-content px-4 py-10 lg:px-6 lg:py-14">{children}</main>
    </div>
  )
}
