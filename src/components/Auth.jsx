import React from 'react';
import { Link } from 'react-router-dom';

function Auth({ formName, onSubmit, title, children, buttonText }) {
  return (
    <div className='auth'>
      <form className='auth__form' name={formName} noValidate onSubmit={onSubmit}>
        <h2 className='auth__title'>{title}</h2>
        {children}
        <button type='submit' className='auth__button'>
          {buttonText}
        </button>
        {formName === 'register' && (
          <p className='auth__text'>
            Уже зарегистрированы?{' '}
            <Link className='auth__link' to='/sign-in'>
              Войти
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default Auth;
