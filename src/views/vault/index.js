/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import {
  bnMultipledByDecimals,
  bnDivdedByDecimals,
  getBNBBalance,
  bnToDec,
} from '../../aDAO/utils'
import {
  getCirculatingSupply,
  getTotalSupply,
  getBalance,
} from '../../aDAO/token'
import {
  getTotalStakedAmount,
  getUserTotalStakedAmount,
  getMinimumDepositAmount,
  getSwapReward,
  getaDAOReward,
  getAllocPointForWBNB,
  getAllocPointForBTCB,
  getAllocPointForBIFI,
  getTVL,
  getRestTimeForaDAORewards,
  getRestTimeForSwapRewards,
  getIsEnalbledLock,
  getStakedUserInfo,
  getAPY,
  getBurnFee,
  getEarlyUnstakeFee,
} from '../../aDAO/vault'
import { getaDAOPrice, getMarketcap } from '../../subgraphs/api'
import {
  networkId,
  vaultContract,
  aDAOBNBPairContract,
  bifiBNBPairContract,
  btcbBNBPairContract,
} from '../../aDAO/contracts'
import { getAmountOut } from '../../aDAO/pancakev2pair'
import { Row, Col } from 'react-bootstrap'
import { NotificationManager } from 'react-notifications'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Form from '../../components/Form'
import Form2 from '../../components/Form2'
import Button from '../../components/Button'
import BetCtrl from '../../components/BetCtrl'
import Label from '../../components/Label'
import ConfirmModal from '../../components/ConfirmModal'
import 'react-notifications/lib/notifications.css'
import { css } from '@emotion/core'
import ClockLoader from 'react-spinners/ClockLoader'
import { sendTransaction, mobileSendTransaction } from '../../aDAO/utils'
import { isMobile } from 'react-device-detect'
import './index.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Layout from '../../layout'

import Label2 from '../../components/Label2'

import stats from '../../icons/stadistics.svg'
import vault from '../../icons/ox.svg'

const override = css`
  position: absolute;
  display: block;
  z-index: 1;
  margin: 15% 30%;
  border-color: red;
`

function Vault() {
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

  const [values, setValues] = useState({
    stakeAmount: '0',
    unstakeAmount: '0',
    claimAmount: '0',
  })

  const [progress, setProgress] = useState(false)

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0))
  const [circulatingSupply, setCirculatingSupply] = useState(new BigNumber(0))
  const [tvl, setTVL] = useState(new BigNumber(0))

  const [aDAOPrice, setaDAOPrice] = useState(0)
  const [marketcap, setMarketcap] = useState(0)
  const [totalStakedAmount, setTotalStakedAmount] = useState(new BigNumber(0))
  const [userBalance, setUserBalance] = useState(new BigNumber(0))
  const [userTotalStakedAmount, setUserTotalStakedAmount] = useState(
    new BigNumber(0)
  )
  const [minDepositAmount, setMinDepositAmount] = useState(new BigNumber(0))
  const [userBNBBalance, setUserBNBBalance] = useState(new BigNumber(0))
  const [userSwapReward, setUserSwapReward] = useState({})
  const [useraDAOReward, setUseraDAOReward] = useState({})
  const [isEnabledLock, setIsEnalbledLock] = useState(true)
  const [stakedUserInfo, setStakedUserInfo] = useState({})

  const [userWbnbAvailableReward, setUserWbnbAvailableReward] = useState(
    new BigNumber(0)
  )
  const [userBtcbAvailableReward, setUserBtcbAvailableReward] = useState(
    new BigNumber(0)
  )
  const [userBifiAvailableReward, setUserBifiAvailableReward] = useState(
    new BigNumber(0)
  )

  const [userWbnbPendingReward, setUserWbnbPendingReward] = useState(0)
  const [userBtcbPendingReward, setUserBtcbPendingReward] = useState(0)
  const [userBifiPendingReward, setUserBifiPendingReward] = useState(0)

  const [pendingaDAOValue, setPendingaDAOValue] = useState(new BigNumber(0))
  const [availableaDAOValue, setAvailableaDAOValue] = useState(new BigNumber(0))

  const [timerID, setTimerID] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isTreasury, setIsTreasury] = useState(false)
  const [isUnstake, setIsUnstake] = useState(false)
  const [burnFee, setBurnFee] = useState(0)
  const [earlyUnstakeFee, setEarlyUnstakeFee] = useState(0)

  const [apy, setApy] = useState(0)

  let transactionType = ''

  const fetchAllDataFromContract = useCallback(
    async (firstFlag = false, transactionType = '') => {
      setTotalSupply(await getTotalSupply())
      setCirculatingSupply(await getCirculatingSupply())
      setTVL(await getTVL())
      setaDAOPrice(await getaDAOPrice())
      setMarketcap(await getMarketcap())
      setTotalStakedAmount(await getTotalStakedAmount())
      setUserBalance(await getBalance(address))
      setUserTotalStakedAmount(await getUserTotalStakedAmount(address))
      setUserBNBBalance(await getBNBBalance(address))
      setUserSwapReward(await getSwapReward(address))
      setUseraDAOReward(await getaDAOReward(address))
      setIsEnalbledLock(await getIsEnalbledLock())
      setStakedUserInfo(await getStakedUserInfo(address))
      setApy(await getAPY())
    },
    [address]
  )

  useEffect(() => {
    if (address) {
      if (timerID > 0) clearInterval(timerID)

      let tempTimerID = setInterval(async () => {
        fetchAllDataFromContract()
      }, 13000)

      setTimerID(tempTimerID)
      fetchAllDataFromContract(true)
    }
  }, [address])

  useEffect(() => {
    const bnaDAOPrice = new BigNumber(aDAOPrice)
    setPendingaDAOValue(bnaDAOPrice.times(useraDAOReward.pending))
    setAvailableaDAOValue(bnaDAOPrice.times(useraDAOReward.available))
  }, [useraDAOReward, aDAOPrice])

  useEffect(async () => {
    if (
      userSwapReward.pending &&
      userSwapReward.pending.isGreaterThan(new BigNumber(0))
    ) {
      const wbnbEstimateAmount = await getAmountOut(
        aDAOBNBPairContract,
        bnToDec(userSwapReward.pending),
        true
      )
      const wbnbRewardAmount = new BigNumber(wbnbEstimateAmount).times(
        await getAllocPointForWBNB()
      )
      const btcbRewardAmount = new BigNumber(wbnbEstimateAmount).times(
        await getAllocPointForBTCB()
      )
      const bifiRewardAmount = new BigNumber(wbnbEstimateAmount).times(
        await getAllocPointForBIFI()
      )

      setUserWbnbPendingReward(wbnbRewardAmount)
      setUserBtcbPendingReward(
        await getAmountOut(
          btcbBNBPairContract,
          btcbRewardAmount.toNumber(),
          false,
          8
        )
      )
      setUserBifiPendingReward(
        await getAmountOut(
          bifiBNBPairContract,
          bifiRewardAmount.toNumber(),
          false
        )
      )
    } else {
      setUserWbnbPendingReward(new BigNumber(0))
      setUserBtcbPendingReward(new BigNumber(0))
      setUserBifiPendingReward(new BigNumber(0))
    }

    if (
      userSwapReward.available &&
      userSwapReward.available.isGreaterThan(new BigNumber(0))
    ) {
      const wbnbEstimateAmount = await getAmountOut(userSwapReward.available)
      const wbnbRewardAmount = wbnbEstimateAmount
        .times(await getAllocPointForWBNB())
        .div(1e18)
      const btcbRewardAmount = wbnbEstimateAmount
        .times(await getAllocPointForBTCB())
        .div(1e18)
      const bifiRewardAmount = wbnbEstimateAmount
        .times(await getAllocPointForBIFI())
        .div(1e18)

      setUserWbnbAvailableReward(wbnbRewardAmount)
      setUserBtcbAvailableReward(
        await getAmountOut(btcbBNBPairContract, btcbRewardAmount, false)
      )
      setUserBifiAvailableReward(
        await getAmountOut(bifiBNBPairContract, bifiRewardAmount, false)
      )
    } else {
      setUserWbnbAvailableReward(new BigNumber(0))
      setUserBtcbAvailableReward(new BigNumber(0))
      setUserBifiAvailableReward(new BigNumber(0))
    }
  }, [userSwapReward])

  useEffect(async () => {
    setMinDepositAmount(await getMinimumDepositAmount())
    setBurnFee(await getBurnFee())
    setEarlyUnstakeFee(await getEarlyUnstakeFee())
  }, [])

  const onChangeHandler = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
  }

  const transactionDone = () => {
    setValues({
      stakeAmount: '0',
      unstakeAmount: '0',
      claimAmount: '0',
    })
    setProgress(false)
    fetchAllDataFromContract(false, transactionType)
  }

  const transactionError = (err) => {
    setProgress(false)
  }

  const onStake = async (event) => {
    if (address == null || progress || values.stakeAmount === '' || !values)
      return

    const stakeAmount = bnMultipledByDecimals(new BigNumber(values.stakeAmount))

    if (stakeAmount.lt(minDepositAmount)) {
      NotificationManager.warning(
        `Minimum deposit amount is ${bnToDec(minDepositAmount).toFixed(1)} BNB`
      )
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods.stake().encodeABI()

    transactionType = 'stake'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError,
        stakeAmount.toString(10)
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError,
        stakeAmount.toString(10)
      )
  }

  const onClaimAvailableaDAOReward = async (event) => {
    if (address == null || progress) return

    const available = useraDAOReward.available

    if (!available || available.lte(new BigNumber(0))) {
      NotificationManager.warning(`There are no available aDAO rewards.`)
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods
      .claimaDAOAvailableReward()
      .encodeABI()
    transactionType = 'claimaDAOAvailableReward'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
  }

  const onShowConfirmModalForaDAO = async () => {
    const restTime = await getRestTimeForaDAORewards(address)
    if (restTime === '0 seconds') {
      NotificationManager.warning(
        `There are no available aDAO rewards.`
      );
      return;
    }
    setShowConfirmModal(true)
    setModalTitle('Notes')
    setIsTreasury(true)
    setIsUnstake(false)
    setModalContent(
      "Early withdrawal of your rewards will result in a " +
        burnFee +
        "% burn of your rewards. You should wait " +
        restTime +
        "  more days to claim your rewards without the penalty. Do you want to continue?"
    );
  }

  const onShowConfirmModalForQuarterly = async () => {
    const restTime = await getRestTimeForSwapRewards(address)
    if (restTime === '0 seconds') {
      NotificationManager.warning(
        `There are no available WBNB/BIFI/BTCB rewards.`
      );
      return;
    }
    setShowConfirmModal(true)
    setModalTitle('Notes')
    setIsTreasury(false)
    setIsUnstake(false)
    setModalContent(
      "Early withdrawal of your Red Envelope rewards will result in a " +
        burnFee +
        "% burn of your rewards. You should wait " +
        restTime +
        " more days to claim your rewards without the penalty. Do you want to continue?"
    );
  }

  const onShowConfirmModalForUnstake = async () => {
    if (isEnabledLock) {
      if (stakedUserInfo.isLocked) {
        setShowConfirmModal(true)
        setModalTitle('Notes')
        setModalContent(
          "Approximately pool has been locked till " +
            stakedUserInfo.endOfLock +
            ". If you want to unstake early, " +
            earlyUnstakeFee +
            "% of LP token will go to DAO treasury, and " +
            burnFee +
            "% of pending rewards will be burned."
        );
      } else {
        await onUnstake();
        setIsUnstake(false);
      }
    }
    setIsUnstake(true)
  }

  useEffect(async () => {
    if (isConfirmed === true) {
      if (isTreasury) {
        await onClaimaDAOReward()
      } else if (isUnstake) {
        await onUnstake()
        setIsUnstake(false)
      } else {
        await onClaimSwapReward()
      }
      setIsConfirmed(false)
    }
  }, [isConfirmed])

  const onClaimaDAOReward = async (event) => {
    const rewards = useraDAOReward.pending.plus(useraDAOReward.available)
    if (address == null || progress) return

    if (!rewards || rewards.lte(new BigNumber(0))) {
      NotificationManager.warning(`There are no aDAO rewards.`)
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods
      .claim888Reward()
      .encodeABI()
    transactionType = 'claim888Reward'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
  }

  const onClaimAvailableSwapReward = async (event) => {
    if (address == null || progress) return

    const available = userSwapReward.available
    if (!available || available.lte(new BigNumber(0))) {
      NotificationManager.warning(
        `There are no available WBNB/BTCB/BIFI rewards.`
      )
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods
      .claimSwapAvailableReward()
      .encodeABI()
    transactionType = 'claimSwapAvailableReward'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
  }

  const onClaimSwapReward = async (event) => {
    const rewards = userSwapReward.pending.plus(userSwapReward.available)
    if (address == null || progress) return

    if (!rewards || rewards.lte(new BigNumber(0))) {
      NotificationManager.warning(`There are no WBNB/BTCB/BIFI rewards.`)
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods
      .claimSwapReward()
      .encodeABI()
    transactionType = 'claimSwapReward'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
  }

  const onUnstake = async (event) => {
    if (address == null || progress || values.unstakeAmount === '' || !values)
      return

    const unstakeAmount = bnMultipledByDecimals(
      new BigNumber(values.unstakeAmount)
    )
    const userTotalStakedAmountBn = bnMultipledByDecimals(userTotalStakedAmount)

    if (
      unstakeAmount.gt(userTotalStakedAmountBn) ||
      unstakeAmount.lte(new BigNumber(0))
    ) {
      NotificationManager.warning(`Invalid amount to unstake.`)
      return
    }

    setProgress(true)

    const encodedABI = vaultContract.contract.methods
      .unstake(unstakeAmount.toString(10))
      .encodeABI()
    transactionType = 'unstake'

    if (isMobile)
      await mobileSendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
    else
      await sendTransaction(
        address,
        vaultContract.address,
        encodedABI,
        transactionDone,
        transactionError
      )
  }

  return (
    <Page>
      {networkId === currentNetworkId ? (
        <>
          <MobileNav>
            <Header />
          </MobileNav>
          <SideContainerLeft>
            <PageHeader title='aDAO Stats' src='none' alt='' />
            <div style={{ height: '30px' }}></div>
            <ClockLoader
              css={override}
              size={150}
              color={'#ffff00'}
              loading={progress}
            />
            <Form title='TOTAL SUPPLY'>
              <span className='numberSpan'>
                {bnDivdedByDecimals(totalSupply).toFormat(4)} aDAO
              </span>
            </Form>

            <Form title='CIRCULATING SUPPLY'>
              <span className='numberSpan'>
                {bnDivdedByDecimals(circulatingSupply).toFormat(4)} aDAO
              </span>
            </Form>

            <Form title='YOUR aDAO BALANCE'>
              <span className='numberSpan'>
                {bnDivdedByDecimals(userBalance).toFormat(4)} aDAO
              </span>
            </Form>

            <Form title='MARKETCAP'>
              <span className='numberSpan'>
                ${new BigNumber(marketcap).toFormat(2)}
              </span>
            </Form>

            <Form title='aDAO PRICE'>
              <span className='numberSpan'>
                ${new BigNumber(aDAOPrice).toFormat(2)}
              </span>
            </Form>

            <Form title='TOTAL VALUE LOCKED'>
              <span className='numberSpan'>
                ${tvl.toFormat(2)} (
                {bnDivdedByDecimals(totalStakedAmount).toFormat(4)} LP)
              </span>
            </Form>
          </SideContainerLeft>
          <div>
            <StyledNav>
              <Header />
            </StyledNav>
            <SideContainerRight>
              <PageHeader title='aDAO-BNB LP VAULT' src='none' alt='' />

              <Form2
                title={
                  'STAKE (APY: ' +
                  new BigNumber(apy).dp(2, 0).toString(10) +
                  '%)'
                }
                style={{ background: 'none' }}
              >
                <Grid>
                  <StakeContainer>
                    <BetCtrl
                      label='My BNB'
                      name='stakeAmount'
                      balance={userBNBBalance}
                      currentVal={values.stakeAmount}
                      onChangeHandler={onChangeHandler}
                    />

                    <Button onClickHandler={onStake} color='red'>
                      Deposit / Stake
                    </Button>
                  </StakeContainer>
                  <StakeContainer>
                    <BetCtrl
                      label='Staked LP'
                      name='unstakeAmount'
                      balance={userTotalStakedAmount}
                      currentVal={values.unstakeAmount}
                      onChangeHandler={onChangeHandler}
                    />

                    <Button
                      onClickHandler={onShowConfirmModalForUnstake}
                      color='red'
                    >
                      Claim / Unstake
                    </Button>
                  </StakeContainer>
                </Grid>
              </Form2>
            </SideContainerRight>
            <SideContainerRight style={{ marginTop: '40px' }}>
              <Grid>
                <RewardsContainer>
                  <PageHeader title='aDAO REWARDS' src='none' alt='' />
                  <Form2>
                    <Grid>
                      <Label
                        label='Pending aDAO'
                        balance={
                          useraDAOReward.pending
                            ? // bnDivdedByDecimals(useraDAOReward.pending).toFormat(
                              //     4
                              //   ) +
                              ' $' +
                              bnDivdedByDecimals(pendingaDAOValue).toFormat(0) +
                              ''
                            : 0 + '($0)'
                        }
                      />

                      <Label
                        label='Available aDAO'
                        balance={
                          useraDAOReward.available
                            ? // bnDivdedByDecimals(
                              //     useraDAOReward.available
                              //   ).toFormat(4) +
                              ' $' +
                              bnDivdedByDecimals(availableaDAOValue).toFormat(
                                0
                              ) +
                              ''
                            : 0 + '($0)'
                        }
                      />
                    </Grid>
                    <Grid>
                      <Button
                        onClickHandler={onClaimAvailableaDAOReward}
                        color='white'
                      >
                        Claim Available
                      </Button>

                      <Button
                        onClickHandler={onShowConfirmModalForaDAO}
                        color='red'
                      >
                        Claim Early
                      </Button>
                    </Grid>
                  </Form2>
                </RewardsContainer>

                <RewardsContainer>
                  <PageHeader title='YFI/WBTC/WETH REWARDS' src='none' alt='' />
                  <Form2>
                    <Grid>
                      <Label2
                        label='Pending'
                        l1='WBNB'
                        b1={
                          userWbnbPendingReward
                            ? userWbnbPendingReward.toFixed(4)
                            : 0
                        }
                        l2='BTCB'
                        b2={
                          userBtcbPendingReward
                            ? userBtcbPendingReward.toFixed(4)
                            : 0
                        }
                        l3='BIFI'
                        b3={
                          userBifiPendingReward
                            ? userBifiPendingReward.toFixed(4)
                            : 0
                        }
                      />

                      <Label2
                        label='Available'
                        l1='WBNB'
                        b1={
                          userWbnbAvailableReward
                            ? userWbnbAvailableReward.toFormat(4)
                            : 0
                        }
                        l2='BTCB'
                        b2={
                          userBtcbAvailableReward
                            ? userBtcbAvailableReward.toFormat(4)
                            : 0
                        }
                        l3='BIFI'
                        b3={
                          userBifiAvailableReward
                            ? userBifiAvailableReward.toFormat(4)
                            : 0
                        }
                      />
                    </Grid>
                    <Grid>
                      <Button
                        onClickHandler={onClaimAvailableSwapReward}
                        color='white'
                      >
                        Claim Available
                      </Button>

                      <Button
                        onClickHandler={onShowConfirmModalForQuarterly}
                        color='red'
                      >
                        Claim Early
                      </Button>
                    </Grid>
                  </Form2>
                </RewardsContainer>
              </Grid>
            </SideContainerRight>
            <Footer></Footer>
          </div>
        </>
      ) : (
        <>
          <ConnectWalletDiv>
            <Header />

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
                          {networkId === '56' ? 'Main' : 'Testnet'} Binance
                          Smart Chain Testnet.
                        </span>
                      </Col>
                    </Row>
                  </Form2>
                </FormContainer>
              </Col>
            </Row>
            <Container>
              <Footer />
            </Container>
          </ConnectWalletDiv>
        </>
      )}
      {showConfirmModal && (
        <ConfirmModal
          title={modalTitle}
          content={modalContent}
          setShowConfirmModal={setShowConfirmModal}
          setIsConfirmed={setIsConfirmed}
        />
      )}
    </Page>
  )
}

const SideContainerLeft = styled.div`
  width: 315px;
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 15px 20px 15px;
  border-radius: 20px;
  height: fit-content;
  @media (max-width: 768px) {
    width: 100%;
  }
`
const SideContainerRight = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 15px 0 15px;
  margin-left: 20px;

  border-radius: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 15px;
  }
`
const StakeContainer = styled.div`
  max-width: 250px;
`
const RewardsContainer = styled.div``
const Container = styled.div`
  margin-left: 9.5%;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ConnectWalletDiv = styled.div`
  width: 100%;
  margin-right: 8.7%;
  @media (max-width: 768px) {
    margin-right: 0;
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const StyledNav = styled.div`
  margin-left: 20px;
  width: 100%;
  @media (max-width: 768px) {
    display: none;
  }
`
const FormContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 15px 0 15px;
  border-radius: 20px;
`

const MobileNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

export default Vault
