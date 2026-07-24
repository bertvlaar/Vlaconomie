import React, { useState, useMemo } from 'react'

export default function BudgetlijnSimulator() {
  const [budget, setBudget] = useState(60)
  const [px, setPx] = useState(20)
  const [py, setPy] = useState(10)

  const maxX = budget / px
  const maxY = budget / py

  const points = useMemo(() => {
    const width = 320
    const height = 260
    const padding = 34
    const scaleX = (width - padding - 15) / Math.max(maxX, 1)
    const scaleY = (height - padding - 10) / Math.max(maxY, 1)
    const x2 = padding + maxX * scaleX
    const y2 = height - padding
    const x1 = padding
    const y1 = height - padding - maxY * scaleY

    // Schaalverdeling: rond het maximum af naar boven en verdeel in nette stappen
    const niceStep = (max) => {
      const rough = max / 5
      const pow10 = Math.pow(10, Math.floor(Math.log10(rough || 1)))
      const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow10)
      return candidates.find((c) => rough <= c) || candidates[candidates.length - 1]
    }
    const stepX = niceStep(maxX)
    const stepY = niceStep(maxY)
    const tickX = []
    for (let v = 0; v <= maxX + 0.001; v += stepX) {
      tickX.push({ value: Math.round(v * 10) / 10, x: padding + v * scaleX })
    }
    const tickY = []
    for (let v = 0; v <= maxY + 0.001; v += stepY) {
      tickY.push({ value: Math.round(v * 10) / 10, y: height - padding - v * scaleY })
    }

    return { width, height, padding, x1, y1, x2, y2, tickX, tickY }
  }, [maxX, maxY])

  return (
    <div className="rounded-lg border border-border bg-pagebg p-5 lg:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Jouw budget (B): <span className="font-semibold text-blue-700">€{budget}</span>
          </label>
          <input
            type="range"
            min="20"
            max="150"
            step="5"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-blue-600"
          />

          <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
            Prijs Kleding (Px): <span className="font-semibold text-blue-700">€{px}</span>
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={px}
            onChange={(e) => setPx(Number(e.target.value))}
            className="w-full accent-blue-600"
          />

          <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
            Prijs Accessoires (Py): <span className="font-semibold text-blue-700">€{py}</span>
          </label>
          <input
            type="range"
            min="2"
            max="40"
            step="1"
            value={py}
            onChange={(e) => setPy(Number(e.target.value))}
            className="w-full accent-blue-600"
          />

          <p className="mt-4 text-sm text-slate-600">
            Met €{budget} kun je maximaal <strong>{maxX.toFixed(1)}</strong> kledingstukken óf{' '}
            <strong>{maxY.toFixed(1)}</strong> accessoires kopen (of een mix daartussen).
          </p>

          <button
            onClick={() => {
              setBudget(60)
              setPx(20)
              setPy(10)
            }}
            className="mt-3 text-sm font-semibold text-blue-700 underline underline-offset-2"
          >
            ↺ Reset simulator
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <svg width={points.width} height={points.height} className="rounded-md border border-border bg-white">
            {/* assen */}
            <line x1={points.padding} y1={10} x2={points.padding} y2={points.height - points.padding} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={points.padding} y1={points.height - points.padding} x2={points.width - 10} y2={points.height - points.padding} stroke="#cbd5e1" strokeWidth="1" />

            {/* tickmarks + cijfers X-as (Kleding) */}
            {points.tickX.map((t, i) => (
              <g key={`x-${i}`}>
                <line x1={t.x} y1={points.height - points.padding} x2={t.x} y2={points.height - points.padding + 5} stroke="#94a3b8" strokeWidth="1" />
                <text x={t.x} y={points.height - points.padding + 17} fontSize="10" fill="#64748b" textAnchor="middle">
                  {t.value}
                </text>
              </g>
            ))}

            {/* tickmarks + cijfers Y-as (Accessoires) */}
            {points.tickY.map((t, i) => (
              <g key={`y-${i}`}>
                <line x1={points.padding - 5} y1={t.y} x2={points.padding} y2={t.y} stroke="#94a3b8" strokeWidth="1" />
                <text x={points.padding - 9} y={t.y + 3} fontSize="10" fill="#64748b" textAnchor="end">
                  {t.value}
                </text>
              </g>
            ))}

            {/* budgetlijn */}
            <line x1={points.x1} y1={points.y1} x2={points.x2} y2={points.y2} stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <circle cx={points.x1} cy={points.y1} r="4" fill="#2563eb" />
            <circle cx={points.x2} cy={points.y2} r="4" fill="#2563eb" />
          </svg>
          <div className="mt-2 flex w-full justify-between text-xs text-slate-500">
            <span>↑ Accessoires (Y)</span>
            <span>Kleding (X) →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
