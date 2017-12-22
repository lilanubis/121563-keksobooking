'use strict';
(function () {
  var map = document.querySelector('.map');
  var popupCloseButton = map.querySelector('.popup__close');

  // взять ключ от объекта
  var getKeyValue = function (obj, key) {
    return obj[key];
  };

  var showPopup = function (evt) {
    closePopup();
    var pinData = evt.currentTarget.pinData;
    var activePin = evt.currentTarget;
    createActiveOffer(pinData);
    activePin.classList.add('map__pin--active');
    map.addEventListener('keydown', popupCloseButtonEscKeydownHandler);
    map.addEventListener('keydown', popupCloseButtonEnterKeyDownHandler);
  };

  // что происходит при закрытии карточки
  var closePopup = function () {
    var activePopup = document.querySelector('.map__card.popup');
    if (activePopup) {
      var activePin = document.querySelector('.map__pin.map__pin--active');
      popupCloseButton = activePopup.querySelector('.popup__close');
      popupCloseButton.removeEventListener('click', popupCloseButtonClickHandler);
      activePopup.remove();
      map.removeEventListener('keydown', popupCloseButtonEscKeydownHandler);
      popupCloseButton.removeEventListener('keydown', popupCloseButtonEnterKeyDownHandler);
      if (activePin) {
        document.querySelector('.map__pin.map__pin--active').classList.remove('map__pin--active');
      }
    }
  };

  // обработчик закрытия карточки
  var popupCloseButtonClickHandler = function () {
    closePopup();
  };

  // если нажали на Esc...
  var popupCloseButtonEscKeydownHandler = function (event) {
    if (event.keyCode === window.data.ESC_KEYCODE) {
      closePopup();
    }
  };

  // ... или на enter по крестику
  var popupCloseButtonEnterKeyDownHandler = function (event) {
    if (event.keyCode === window.data.ENTER_KEYCODE) {
      closePopup();
    }
  };

  // собираем шаблон карточки с предложением
  var createOffer = function (offerData) {
    var offerTemplate = document.querySelector('template').content.querySelector('article').cloneNode(true);
    var offer = offerData.offer;
    offerTemplate.querySelector('h3').textContent = offer.title;
    offerTemplate.querySelector('small').textContent = offer.address;
    offerTemplate.querySelector('.popup__price').textContent = offer.price + '₽/ночь';
    offerTemplate.querySelector('h4').textContent = getKeyValue(window.data.OFFERS_INFO.type, offer.type);
    offerTemplate.querySelector('p:nth-of-type(3)').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    offerTemplate.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    offerTemplate.querySelector('p:nth-of-type(5)').textContent = offer.description;
    offerTemplate.querySelector('img').src = offerData.author.avatar;
    offerTemplate.querySelector('.popup__features').textContent = '';

    var featuresHtmlString = '';
    for (var i = 0; i < offerData.offer.features.length; i++) {
      featuresHtmlString += '<li class="feature feature--' + offerData.offer.features[i] + '"></li>';
    }
    offerTemplate.querySelector('.popup__features').insertAdjacentHTML('afterbegin', featuresHtmlString);
    return offerTemplate;
  };

  // cоздаем шаблон одной активной карточки
  var createActiveOffer = function (offer) {
    var offerElement = createOffer(offer);
    map.insertBefore(offerElement, map.children[1]);

    // слушаем клики
    var popupCloseButton = document.querySelector('.popup__close');
    popupCloseButton.addEventListener('click', closePopup);
    popupCloseButton.addEventListener('keydown', popupCloseButtonEscKeydownHandler);
    popupCloseButton.addEventListener('keydown', popupCloseButtonEnterKeyDownHandler);
  };

  window.card = {
    closeCard: closePopup,
    showCard: showPopup
  };
})();
