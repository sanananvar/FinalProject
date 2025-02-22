import React from 'react';
import { Link } from 'react-router-dom';

const CenterLogo = () => {
  return (
    <Link to="/" className='center-logo'>
        <img src="/public/kaffeinTextLogo.svg" alt="" />
    </Link>
  )
}

export default CenterLogo
