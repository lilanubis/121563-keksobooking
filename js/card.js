'use strict';
(function () {
  var map = document.querySelector('.map');

  // взять ключ от объекта
  var getKeyValue = function (obj, key) {
    return obj[key];
  };

  // заводим переменную для активного попапа с карточкой
  var activePopup = null;

  // что происходит при закрытии карточки
  var closePopup = function () {
    window.pin.activePin.classList.remove('map__pin--active');
    window.popupCloseButton = activePopup.querySelector('.popup__close');
    window.popupCloseButton.removeEventListener('click', popupCloseButtonClickHandler);
    map.removeEventListener('keydown', popupCloseButtonKeydownHandler);
    activePopup.remove();
    activePopup = null;
  };

  // обработчик закрытия карточки
  var popupCloseButtonClickHandler = function () {
    closePopup();
  };

    // если нажали на Esc или на enter по крестику
  var popupCloseButtonKeydownHandler = function (event) {
    if (event.keyCode === window.data.ESC_KEYCODE || event.keyCode === window.data.ENTER_KEYCODE) {
      closePopup();
    }
  };

  // собираем шаблон карточки с предложением
  var createOffer = function (offerData, template) {
    var getOffer = template.cloneNode(true);
    var offer = offerData.offer;
    getOffer.querySelector('h3').textContent = offer.title;
    getOffer.querySelector('small').textContent = offer.address;
    getOffer.querySelector('.popup__price').textContent = offer.price + '₽/ночь';
    getOffer.querySelector('h4').textContent = getKeyValue(window.data.OFFERS_INFO.type, offer.type);
    getOffer.querySelector('p:nth-of-type(3)').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    getOffer.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    getOffer.querySelector('p:nth-of-type(5)').textContent = offer.description;
    getOffer.querySelector('img').src = offerData.author.avatar;
    getOffer.querySelector('.popup__features').innerHTML = '';

    var featuresHtmlString = '';
    for (var j = 0; j < offerData.offer.features.length; j++) {
      featuresHtmlString += '<li class="feature feature--' + offerData.offer.features[j] + '"></li>';
    }
    getOffer.querySelector('.popup__features').insertAdjacentHTML('afterbegin', featuresHtmlString);
    return getOffer;
  };

  // cоздаем шаблон одной активной карточки
  var createActiveOffer = function (offer, template) {
    var offerElement = createOffer(offer, template);
    return map.insertBefore(offerElement, map.children[1]);
  };

  window.card = {
    activePopup: activePopup,
    createActiveOffer: createActiveOffer,
    closePopup: closePopup,
    popupCloseButtonClickHandler: popupCloseButtonClickHandler
  };
})();
