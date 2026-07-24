import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import Thema1Layout from './components/Thema1Layout.jsx'
import Home from './pages/Home.jsx'
import Start from './pages/Start.jsx'
import Les11 from './pages/Les11.jsx'
import Les12 from './pages/Les12.jsx'
import Les13 from './pages/Les13.jsx'
import Les14 from './pages/Les14.jsx'
import Begrippenlijst from './pages/Begrippenlijst.jsx'
import ExtraRekenopdrachten from './pages/ExtraRekenopdrachten.jsx'
import Eindquiz from './pages/Eindquiz.jsx'
import Project from './pages/Project.jsx'
import VoorDeDocent from './pages/VoorDeDocent.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/thema-1" element={<Thema1Layout />}>
          <Route index element={<Start />} />
          <Route path="les-1-1" element={<Les11 />} />
          <Route path="les-1-2" element={<Les12 />} />
          <Route path="les-1-3" element={<Les13 />} />
          <Route path="les-1-4" element={<Les14 />} />
          <Route path="begrippenlijst" element={<Begrippenlijst />} />
          <Route path="extra-rekenopdrachten" element={<ExtraRekenopdrachten />} />
          <Route path="eindquiz" element={<Eindquiz />} />
          <Route path="project" element={<Project />} />
          <Route path="voor-de-docent" element={<VoorDeDocent />} />
        </Route>
      </Routes>
    </>
  )
}
