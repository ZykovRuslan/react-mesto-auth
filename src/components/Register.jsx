import React, { useEffect, useState } from 'react';
import Auth from './Auth.jsx';
import Header from './Header.jsx';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister, isLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleChange(evt) {
    const { value } = evt.target;
    evt.target.name === 'Email' ? setEmail(value) : setPassword(value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(email, password);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Header />
      <div className='register'>
        <Auth
          formName='register'
          onSubmit={handleSubmit}
          title='Регистрация'
          buttonText='Зарегистрироваться'>
          <input
            name='Email'
            type='email'
            className='popup__input popup__input_type_login'
            id='email'
            placeholder='Email'
            minLength='6'
            maxLength='40'
            required
            value={email || ''}
            onChange={handleChange}
          />
          <input
            name='Password'
            type='password'
            className='popup__input popup__input_type_login'
            id='password'
            placeholder='Пароль'
            minLength='6'
            maxLength='40'
            required
            value={password || ''}
            onChange={handleChange}
          />
        </Auth>
      </div>
    </>
  );
}

export default Register;
