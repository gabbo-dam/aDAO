import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import './label.css'

function Label2({ label, balance, l1, l2, l3, b1, b2, b3 }) {
  return (
    <>
      <StyledBox>
        <div className='form-label'>{label}</div>
        <div className='box'>
          <div>
            <span className='l'>{l1}: </span>
            <span className='b'>{b1}</span>
          </div>
          <div>
            <span className='l'>{l2}: </span>
            <span className='b'>{b2}</span>
          </div>
          <div>
            <span className='l'>{l3}: </span>
            <span className='b'>{b3}</span>
          </div>
        </div>
      </StyledBox>
    </>
  )
}

const StyledBox = styled.div`
  width: 100%;

  height: 160px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
`

export default Label2
