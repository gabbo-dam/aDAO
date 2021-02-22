/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { get$888Price } from '../../subgraphs/api'
import { networkId } from '../../$888/contracts'
import {
  getWinners,
  getWinnersInfo,
  getCollectedLotteryAmount,
  getLotteryTotalPaidOut,
  getLotteryFee,
  getLotteryLimit,
} from '../../$888/vault'
import { bnToDec } from '../../$888/utils'
import { Row, Col } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import Form from '../../components/Form'
import Form2 from '../../components/Form2'
import Form3 from '../../components/Form3'
import 'react-notifications/lib/notifications.css'
import Page from '../../components/Page'
import './index.css'
import styled from 'styled-components'
import Label from '../../components/Label'

import lottery from '../../icons/lottery.svg'
import win from '../../icons/winners.svg'

function Lottery() {
  const address = useSelector((state) => state.authUser.address)
  const currentNetworkId = useSelector((state) => state.authUser.networkId)

  BigNumber.config({
    DECIMAL_PLACES: 18,
    FORMAT: {
      // string to prepend
      prefix: '',
      // decimal separator
      decimalSeparator: '.',
      // grouping separator of the integer part
      groupSeparator: ',',
      // primary grouping size of the integer part
      groupSize: 3,
    },
  })

  const [$888Price, set$888Price] = useState(0)
  const [winners, setWinners] = useState(0)
  const [lotteryAmount, setLotteryAmount] = useState(new BigNumber(0))
  const [winnersInfo, setWinnersInfo] = useState([])
  const [poolValue, setPoolValue] = useState(new BigNumber(0))
  const [totalPaidOut, setTotalPaidOut] = useState(new BigNumber(0))
  const [totalPaidOutValue, setTotalPaidOutValue] = useState(new BigNumber(0))
  const [lotteryFee, setLotteryFee] = useState(0)
  const [lotteryLimit, setLotteryLimit] = useState(0)

  const [timerID, setTimerID] = useState(0)

  const fetchAllDataFromContract = useCallback(
    async (firstFlag = false, transactionType = '') => {
      set$888Price(await get$888Price())
      setWinners(await getWinners())
      setLotteryAmount(await getCollectedLotteryAmount())
      setWinnersInfo(await getWinnersInfo())
      setTotalPaidOut(await getLotteryTotalPaidOut())
      setLotteryFee(await getLotteryFee())
      setLotteryLimit(await getLotteryLimit())
    },
    [address]
  )

  useEffect(() => {
    if (address) {
      if (timerID > 0) clearInterval(timerID)

      let tempTimerID = setInterval(async () => {
        fetchAllDataFromContract()
      }, 120000)

      setTimerID(tempTimerID)
      fetchAllDataFromContract(true)
    }
  }, [address])

  useEffect(() => {
    setPoolValue(new BigNumber($888Price).times(lotteryAmount))
    setTotalPaidOutValue(new BigNumber($888Price).times(totalPaidOut))
  }, [$888Price, lotteryAmount, totalPaidOut])

  return (
    <Container>
      {networkId === currentNetworkId ? (
        <>
          <StyledContainer>
            <StyledSection>
              <PageHeader title='aDAO LOTTERY' src='none' alt='' />
              <Form2 title='How it works'>
                <span className='textSpan'>
                  We take {lotteryFee}% from the collected taxfees and put it
                  inside this lottery pool, each time the pool reaches a value
                  of {lotteryLimit} USD a random LP staker gets selected as the
                  winner. Winner takes all!
                </span>
              </Form2>
            </StyledSection>
          </StyledContainer>
          <LoterryContainer>
            <StyledContainer>
              <Form3 title='CURRENT POOL'>
                <span className='numberSpan2'>
                  ${bnToDec(poolValue).toFixed(2)}
                </span>
                <div className='numberSpan2'>
                  ({bnToDec(lotteryAmount).toFixed(4)} aDAO)
                </div>
              </Form3>
            </StyledContainer>
            <StyledContainer>
              <Form3 title='TOTAL WINNERS'>
                <span className='numberSpan2'>{winners}</span>
              </Form3>
            </StyledContainer>
            <StyledContainer>
              <Form3 title='TOTAL PAID OUT'>
                <span className='numberSpan2'>
                  ${bnToDec(totalPaidOutValue).toFixed(2)}
                </span>
                <div className='numberSpan2'>
                  ({bnToDec(totalPaidOut).toFixed(4)} aDAO)
                </div>
              </Form3>
            </StyledContainer>
          </LoterryContainer>
          <StyledContainer>
            <StyledSection>
              <PageHeader title='WINNERS' src='none' alt='' />

              <Form2 title=''>
                <WinnersContainer>
                  <Address>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Address</p>

                    {winnersInfo?.map((element, index) => (
                      <div style={{ fontSize: '16px', color: '#FFFFFF' }}>
                        {element.address}
                      </div>
                    ))}
                  </Address>
                  <Transaction>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Treansaction Time
                    </p>

                    {winnersInfo?.map((element, index) => (
                      <div style={{ fontSize: '16px', color: '#FFFFFF' }}>
                        {element.timestamp}
                      </div>
                    ))}
                  </Transaction>
                  <Prize>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Prize </p>

                    {winnersInfo?.map((element, index) => (
                      <div style={{ fontSize: '16px' }}>
                        {bnToDec(element.amount).toFixed(4)} $aDAO ($
                        {bnToDec(
                          new BigNumber($888Price).times(element.amount)
                        ).toFixed(2)}
                        )
                      </div>
                    ))}
                  </Prize>
                </WinnersContainer>
              </Form2>
            </StyledSection>
          </StyledContainer>
        </>
      ) : (
        <>
          <Row>
            <Col xs={12}>
              <FormContainer>
                <Form2 title='Warning'>
                  <Row>
                    <Col xs={12} className='pt-3'>
                      <span>Unable to connect wallet</span>
                      <br />
                      <span>
                        Please change your MetaMask to access the{' '}
                        {networkId === '56' ? 'Main' : 'Testnet'} Binance Smart
                        Chain Testnet.
                      </span>
                    </Col>
                  </Row>
                </Form2>
              </FormContainer>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  padding: 0 10%;

  @media screen and (max-width: 480px) {
    padding: 30px 5%;
  }
`
const LoterryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  margin: 25px auto;
  width: 70%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 30px;
  }
`
const WinnersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  height: 250px;
  overflow: auto;
`

const StyledContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);

  border-radius: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
`
const StyledSection = styled.div`
  padding: 30px 40px 0 40px;
`

const FormContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 15px 0 15px;
  border-radius: 20px;
`

const Address = styled.div``
const Transaction = styled.div``
const Prize = styled.div``

export default Lottery
