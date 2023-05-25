import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import { api, apiAuth } from '../utils';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import InfoTooltip from './InfoTooltip';
import correctly from '../static/images/correctly.svg';
import notCorrectly from '../static/images/not-correct.svg';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ path: '', text: '' });

  useEffect(() => {
    if (!isLoggedIn) return;
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => console.log(err));

    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, [isLoggedIn]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(likes, _id) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(_id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === _id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(id) {
    api
      .deleteCard(id)
      .then(() => setCards((state) => state.filter((item) => item._id !== id)))
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(data) {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function heandleRegister(email, password) {
    apiAuth
      .signup({ email, password })
      .then((result) => {
        setEmail(result.data.email);
        setMessage({ path: correctly, text: 'Вы успешно зарегистрировались!' });
      })
      .catch(() =>
        setMessage({ path: notCorrectly, text: 'Что-то пошло не так! Попробуйте ещё раз.' }),
      )
      .finally(() => setIsInfoTooltipOpen(true));
  }

  function heandleLogin(email, password) {
    apiAuth
      .signin({ email, password })
      .then((res) => localStorage.setItem('JWT', res.token))
      .then(() => setIsLoggedIn(true))
      .catch(console.log);
  }

  useEffect(() => {
    async function checkAuth() {
      if (!localStorage.getItem('JWT')) return;
      try {
        const res = await apiAuth.checkToken(localStorage.getItem('JWT'));
        if (res.data) {
          setEmail(res.data.email);
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
        console.log(err);
      }
    }
    checkAuth();
  }, []);

  function onSignOut() {
    localStorage.removeItem('JWT');
    setIsLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
                isLoggedIn={isLoggedIn}
                email={email}
                onSignOut={onSignOut}
              />
            }
          />
          <Route
            path='sign-up'
            element={<Register onRegister={heandleRegister} isLoggedIn={isLoggedIn} />}
          />
          <Route path='sign-in' element={<Login onAuth={heandleLogin} isLoggedIn={isLoggedIn} />} />
          <Route path='*' element={isLoggedIn ? <Navigate to='/' /> : <Navigate to='/sign-in' />} />
        </Routes>
        <Footer />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={message.text}
          path={message.path}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        {/*Попап Вы уверены?*/}
        <PopupWithForm name='confirmation' title='Вы уверены?' isOpen={false} />

        {/*Попап Увеличение фото*/}
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
