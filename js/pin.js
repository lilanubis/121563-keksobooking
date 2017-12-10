'use strict';
(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  // заводим переменную для активного пина
  var activePin = null;

  // что происходит при открытии пина
  var pinClickHandler = function (evt) {

    var showPopup = function () {
      var pinData = evt.currentTarget.pinData;
      activePin = evt.currentTarget;
      window.card.activePopup = window.card.createActiveOffer(pinData, document.querySelector('template'));
      activePin.classList.add('map__pin--active');

      // слушаем клики
      window.card.popupCloseButton.addEventListener('click', window.card.closePopup);
      map.addEventListener('keydown', window.card.popupCloseButtonClickHandler);
      window.card.popupCloseButton.addEventListener('keydown', window.card.popupCloseButtonClickHandler);
    };

    // если карточки на экране нет
    if (window.card.activePopup === null) {
      showPopup();

    // если карточка на экране уже есть
    } else {
      window.card.closePopup();
      showPopup();
    }
  };

  // если нажали на Enter
  var pinKeydownHandler = function (evt) {
    if (evt.target === window.data.ENTER_KEYCODE) {
      pinClickHandler();
    }
  };

  // собираем шаблон пина
  var createPin = function (pinData, template) {
    var pin = template.cloneNode(true);
    pin.style.left = pinData.location.x + 'px';
    pin.style.top = pinData.location.y + 'px';
    pin.querySelector('img').src = pinData.author.avatar;
    pin.pinData = pinData;
    pin.addEventListener('click', pinClickHandler);
    pin.addEventListener('keydown', pinKeydownHandler);

    return pin;
  };

  // собираем все пины из реальных данных
  var createAllPins = function (array) {
    var fragmentPin = document.createDocumentFragment();
    for (var l = 0; l < array.length; l++) {
      fragmentPin.appendChild(createPin(array[l], pinTemplate));
    }
    mapPins.appendChild(fragmentPin);
  };

  // создаем события для шелчка по главному Пину
  var mainPinMouseupHandler = function () {
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    createAllPins(window.allOffersArray);
    document.querySelector('.map').classList.remove('map--faded');
    window.form.enableForm();
  };

  // щелкаем по главному пину
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  window.pin = {
    activePin: activePin
  };
})();
