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
    window.popupCloseButton = activePopup.querySelector('.popup__close');
    window.popupCloseButton.removeEventListener('click', popupCloseButtonClickHandler);
    map.removeEventListener('keydown', popupCloseButtonKeydownHandler);
    activePopup.remove();
    activePopup = null;
  };

  var showPopup = function (evt) {
    var pinData = evt.currentTarget.pinData;
    var activePin = evt.currentTarget;
    createActiveOffer(pinData, document.querySelector('template'));
    activePin.classList.add('map__pin--active');
    map.addEventListener('keydown', window.card.popupCloseButtonKeydownHandler);
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
    var offerTemplate = template.cloneNode(true).content;
    var offer = offerData.offer;
    offerTemplate.querySelector('h3').textContent = offer.title;
    offerTemplate.querySelector('small').textContent = offer.address;
    offerTemplate.querySelector('.popup__price').textContent = offer.price + '₽/ночь';
    offerTemplate.querySelector('h4').textContent = getKeyValue(window.data.OFFERS_INFO.type, offer.type);
    offerTemplate.querySelector('p:nth-of-type(3)').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    offerTemplate.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    offerTemplate.querySelector('p:nth-of-type(5)').textContent = offer.description;
    offerTemplate.querySelector('img').src = offerData.author.avatar;
    offerTemplate.querySelector('.popup__features').innerHTML = '';

    var featuresHtmlString = '';
    for (var j = 0; j < offerData.offer.features.length; j++) {
      featuresHtmlString += '<li class="feature feature--' + offerData.offer.features[j] + '"></li>';
    }
    offerTemplate.querySelector('.popup__features').insertAdjacentHTML('afterbegin', featuresHtmlString);
    return offerTemplate;
  };

  // cоздаем шаблон одной активной карточки
  var createActiveOffer = function (offer, template) {
    var offerElement = createOffer(offer, template);
    return map.insertBefore(offerElement, map.children[1]);

    // слушаем клики
    var popupCloseButton = document.querySelector('.popup__close');
    popupCloseButton.addEventListener('click', window.card.closePopup);
    popupCloseButton.addEventListener('keydown', window.card.popupCloseButtonClickHandler);
  };

  window.card = {
    createActiveOffer: createActiveOffer,
    closePopup: closePopup,
    popupCloseButtonClickHandler: popupCloseButtonClickHandler
  };

  window.card = {
    showPopup: showPopup
  };
})();
