import React from 'react'
import './button.css'

function Button({ children, onClickHandler, color }) {
  return (
    <>
      {color === 'red' ? (
        <div className='rbutton' onClick={(e) => onClickHandler(e)}>
          {children}
        </div>
      ) : (
        <div className='wbutton' onClick={(e) => onClickHandler(e)}>
          {children}
        </div>
      )}
    </>
  )
}

export default Button
