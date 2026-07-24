import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'

export default function Thema1Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
