import React from 'react'
// import './footer.css'
import styled from 'styled-components'

import twitter from '../../icons/Twitter.svg'
import discord from '../../icons/Discord.svg'
import telegram from '../../icons/Telegram.svg'
import github from '../../icons/Github.svg'
import bunny from '../../icons/Bunny.svg'

function Footer() {
  return (
    <StyledFooter>
      <StyledNav>
        <img src={twitter} alt='Twitter'></img>

        <img src={discord} alt='Discord'></img>

        <img src={telegram} alt='Telegram'></img>

        <img src={github} alt=''></img>

        <img src={bunny} alt=''></img>
      </StyledNav>
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  padding-top: 35px;
  width: 100%;
  display: flex;
  // min-width: 414px;
  margin: 0 auto;
  justify-content: center;
`
const StyledNav = styled.div`
  width: 40%;
  display: flex;
  min-width: 414px;
  margin: 0 auto;
  justify-content: space-around;
`

export default Footer
