/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Vaste huisstijl (zie blauwdruk 'Voor de docent' README)
        header: '#0f172a',      // donkerblauw - header
        action: '#2563eb',      // fris blauw - download/actieknoppen
        pagebg: '#f8fafc',      // slate achtergrond
        border: '#e2e8f0',      // subtiele grijze randen
        docent: '#b91c1c',      // rode accent - 'Voor de docent'
        docentbg: '#fef2f2',    // subtiele andere achtergrond docentpagina
        flash: '#ee4d8b',       // knalroze accent - homepage / thema-kaarten
        flashdark: '#c23770',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '64rem', // max-w-5xl equivalent, gebruikt als 'content' alias
      },
    },
  },
  plugins: [],
}
