import React from 'react';
import logo from '../static/images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ isLoggedIn, email, onSignOut }) {
  const location = useLocation();
  return (
    <header className='header'>
      <img src={logo} className='header__logo' alt='Логотип Места России' />
      {location.pathname === '/sign-in' && (
        <Link className='header__link' to={'/sign-up'}>
          Регистрация
        </Link>
      )}
      {location.pathname === '/sign-up' && (
        <Link className='header__link' to={'/sign-in'}>
          Вход
        </Link>
      )}
      {isLoggedIn && (
        <>
          <div className='header__align'>
            {email}
            <Link className='header__link' to={'/sign-in'} onClick={onSignOut}>
              Выйти
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
