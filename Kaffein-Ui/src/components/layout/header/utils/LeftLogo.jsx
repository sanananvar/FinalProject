import React from 'react'
import { Link } from 'react-router-dom'

const LeftLogo = () => {
  return (
    <Link to="/" className='left-logo'>
        <img src="/public/logo.svg" alt="" />
    </Link>
  )
}

export default LeftLogo
