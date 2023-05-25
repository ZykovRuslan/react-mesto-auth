function InfoTooltip({ isOpen, onClose, title, path }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container'>
        <div className='popup__wrap'>
          <img src={path} alt={path} className='popup__tooltip' />
          <h2 className='popup__title-tooltip'>{title}</h2>
        </div>
        <button
          onClick={onClose}
          className='popup__close-button opacity'
          aria-label='закрыть'
          type='button'
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
