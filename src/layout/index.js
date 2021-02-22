import React from 'react'
import Header2 from '../components/Header2'
import Footer from '../components/Footer'
import './layout.css'

function Layout({ children }) {
  return (
    <div className='layout'>
      <Header2 />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
