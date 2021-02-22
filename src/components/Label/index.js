import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import './label.css'

function Label({ label, balance }) {
  return (
    <>
      <StyledBox>
        <div className='form-label'>{label}</div>
        <div className='form-balance'>{balance}</div>
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

export default Label
