import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Nav, Navbar, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { NotificationManager } from 'react-notifications'
import { setAddress, setNetworkId } from '../../redux/actions'
import styled from 'styled-components'

import logo from '../../images/logo.svg'
import './header2.css'
import { useWallet } from 'use-wallet'

function Header() {
  const wallet = useWallet()
  console.log('wallet >>>', wallet)

  const dispatch = useDispatch()
  const address = useSelector((state) => state.authUser.address)
  console.log(address)
  // const networkId = useSelector(state => state.authUser.networkId);

  const onConnectClick = async () => {
    if (wallet.status === 'disconnected') {
      wallet.connect()
    } else if (wallet.status === 'connected') {
      dispatch(setAddress(wallet.account))
      dispatch(setNetworkId(wallet.chainId.toString(10)))
    } else if (wallet.status === 'error') {
      NotificationManager.warning('Please install MetaMask!')
      return
    }

    console.log(wallet.account)
    console.log(wallet.chainId)
    console.log(wallet.ethereum)
    console.log(wallet.status)
  }

  return (
    <StyledNav2>
      <Navbar vbar='true' collapseOnSelect expand='lg'>
        <Navbar.Brand href='/'>
          <h1 style={{ color: '#F0B90B' }}>Logo</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <NavLink
              className='menu-item'
              to='/vault'
              activestyle={{ color: '#ffffff' }}
            >
              VAULT
            </NavLink>
            <NavLink
              className='menu-item'
              to='/lottery'
              activestyle={{ color: '#ffffff' }}
              rel='noreferrer'
            >
              LOTTERY
            </NavLink>
            <Nav.Link
              className='menu-item'
              onClick={() => alert('Coming soon!')}
              activestyle={{ color: '#ffffff' }}
            >
              VOTE
            </Nav.Link>
            <Nav.Link
              className='menu-item'
              href='#'
              activestyle={{ color: '#ffffff' }}
              target='_blank'
              rel='noreferrer'
            >
              ABOUT
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href='#'>
              {address === null ? (
                <Button
                  variant='warning'
                  onClick={() => onConnectClick()}
                  style={{ width: '182px', borderRadius: '58px' }}
                >
                  Wallet Connect
                </Button>
              ) : (
                <Button
                  variant='warning'
                  onClick={(e) => {
                    window.open(
                      window.ethereum.networkVersion === '56'
                        ? `https://bscscan.com/address/${address}`
                        : `https://testnet.bscscan.com/address/${address}`,
                      '_blank'
                    )
                  }}
                  width='100%'
                  style={{ borderRadius: '58px' }}
                >
                  {`${address.substring(0, 7)}...${address.substring(
                    address.length - 5,
                    address.length
                  )}`}
                </Button>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </StyledNav2>
  )
}

const StyledNav2 = styled.div`
  display: flex;
  align-items: center;
  height: 114px;
  margin: 30px 10%;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);

  @media (max-width: 768px) {
    height: 100%;
    margin: 30px auto;
    width: 90%;
  }
`

export default Header
