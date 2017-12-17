'use strict';
(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  // что происходит при открытии пина
  var pinClickHandler = function (evt) {
    var activePopup = document.querySelector('.map__card.popup');
    // если карточки на экране нет
    if (!activePopup) {
      window.showCard(evt);

    // если карточка на экране уже есть
    } else {
      window.card.closePopup();
      window.showCard(evt);
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

  // обработчики
  var loadHandler = function (response) {
    createAllPins(response);
  };
  var errorHandler = function () {
    window.errorMessage();
  };
  // создаем события для шелчка по главному Пину
  var mainPinMouseupHandler = function () {
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    window.backend.load(loadHandler, errorHandler);
    document.querySelector('.map').classList.remove('map--faded');
    window.form.enableForm();
  };

  // щелкаем по главному пину
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  window.pin = {
    createAllPins: createAllPins
  };
})();
