import React from 'react'
import './form3.css'

function Form2({ title, children, text }) {
  return (
    <div className='form3'>
      <h4>{title}</h4>
      <p className='styledtext'>{text}</p>
      {children}
    </div>
  )
}

export default Form2
