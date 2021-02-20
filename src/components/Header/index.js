import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Nav, Navbar, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { NotificationManager } from 'react-notifications'
import { setAddress, setNetworkId } from '../../redux/actions'

import logo from '../../images/logo.svg'
import './header.css'
import { useWallet } from 'use-wallet'

function Header() {
  const wallet = useWallet()
  console.log('wallet >>>', wallet);

  const dispatch = useDispatch()
  const address = useSelector((state) => state.authUser.address)
  console.log(address)
  // const networkId = useSelector(state => state.authUser.networkId);

  const onConnectClick = async () => {
    if (wallet.status === 'disconnected') {
      wallet.connect();
    } else if (wallet.status === 'connected') {
      dispatch(setAddress(wallet.account))
      dispatch(setNetworkId(wallet.chainId.toString(10)))
    } else if (wallet.status === 'error') {
      NotificationManager.warning('Please install MetaMask!')
      return
    }

    console.log(wallet.account);
    console.log(wallet.chainId);
    console.log(wallet.ethereum);
    console.log(wallet.status);
  }

  return (
    <Navbar vbar="true" collapseOnSelect expand='lg'>
      <Navbar.Brand href='/'>
        <img src={logo} className='logo' alt='$888 Logo' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          <NavLink
            className='menu-item'
            to='/vault'
            activestyle={{ color: '#EE2529' }}
          >
            VAULT
          </NavLink>
          <NavLink
            className='menu-item'
            to='/lottery'
            activestyle={{ color: '#EE2529' }}
            rel='noreferrer'
          >
            LOTTERY
          </NavLink>
          <Nav.Link
            className='menu-item'
            onClick={() => alert('Coming soon!')}
            activestyle={{ color: '#EE2529' }}
          >
            VOTE
          </Nav.Link>
          <Nav.Link
            className='menu-item'
            href='https://$888dao.medium.com/introducing-$888-dao-$888-6c973279dad5'
            activestyle={{ color: '#EE2529' }}
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
                variant='danger'
                onClick={() => onConnectClick()}
                style={{ width: '182px', borderRadius: '58px' }}
              >
                Wallet Connect
              </Button>
            ) : (
              <Button
                variant='outline-info'
                onClick={(e) => {
                  window.open(
                    window.ethereum.networkVersion === '56'
                    ? `https://bscscan.com/address/${address}`
                    : `https://testnet.bscscan.com/address/${address}`,
                    '_blank'
                  )
                }}
                width='100%'
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
  )
}

export default Header
