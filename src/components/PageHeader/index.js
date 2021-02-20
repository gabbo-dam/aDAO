import React from 'react'
import './pageheader.css'

function PageHeader({ title, content, alt, src }) {
  return (
    <div className='pageheader'>
      <img className='pageheaderimg' src={src} alt={alt} />
      <h2>{title}</h2>
      <span className='content'>{content}</span>
    </div>
  )
}

export default PageHeader
