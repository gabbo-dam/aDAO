import React from 'react'
import { Row, Col } from 'react-bootstrap'
import './label.css'

function Label({ label, balance }) {
  return (
    <Row className=''>
      <Col xl={12}>
        <span className='form-label'>
          {label}: {balance}
        </span>
      </Col>
    </Row>
  )
}

export default Label
