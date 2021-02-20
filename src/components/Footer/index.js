import React from 'react'
import './footer.css'

import twitter from '../../icons/twitter.svg'
import discord from '../../icons/discord.svg'
import telegram from '../../icons/telegram.svg'
import github from '../../icons/github.svg'
import bunny from '../../icons/bunny.svg'
import dextools from '../../icons/icon.svg'

function Footer() {
  return (
    <div className='footer'>
      <ul>
        <li>
          <img src={twitter} alt='Twitter'></img>
        </li>
        <li>
          <img src={discord} alt='Discord'></img>
        </li>
        <li>
          <img src={telegram} alt='Telegram'></img>
        </li>
        <li>
          <img src={github} alt=''></img>
        </li>
        <li>
          <img src={bunny} alt=''></img>
        </li>
        <li>
          <img src={dextools} alt='Dextools'></img>
        </li>
      </ul>
    </div>
  )
}

export default Footer
