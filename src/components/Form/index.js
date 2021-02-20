import React from 'react'
import './form.css'

function Form({ title, children, text }) {
  return (
    <div className='form '>
      <h4>{title}</h4>
      <p className='styledtext'>{text}</p>
      {children}
    </div>
  )
}

export default Form
