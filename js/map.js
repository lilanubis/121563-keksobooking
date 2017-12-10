'use strict';

// переменные для объектов, которые есть в Доме изначально
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');

// вспомогательные функции
// выбрать случайное число от.. до..
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// выбрать случайный элемент массива
var getRandomArrayItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// собрать массив случайных элементов из другого массива
var getRandomElementsArray = function (array) {
  var newArray = [];
  for (var j = 0; j < array.length; j++) {
    if (Math.random() < 0.5) {
      newArray.push(array[j]);
    }
  }
  return newArray;
};

// взять ключ от объекта
var getKeyValue = function (obj, key) {
  return obj[key];
};

// собираем шаблон массива allOffersArray
var createallOffersArrayArray = function (numberOfOffers, offersInfo) {
  var allOffersArray = [];
  for (var k = 0; k < numberOfOffers; k++) {
    var x = getRandomNumber(window.data.LOCATION_MIN_MAX.x.min, window.data.LOCATION_MIN_MAX.x.max);
    var y = getRandomNumber(window.data.LOCATION_MIN_MAX.y.min, window.data.LOCATION_MIN_MAX.y.max) - window.data.PIN_HEIGHT;
    allOffersArray[k] =
      {
        author: {
          avatar: 'img/avatars/user0' + (k + 1) + '.png'
        },
        offer: {
          title: getRandomArrayItem(offersInfo.title),
          address: x + ', ' + y,
          price: getRandomNumber(window.data.PRICE_MIN_MAX.min, window.data.PRICE_MIN_MAX.max),
          type: getRandomArrayItem(Object.keys(offersInfo.type)),
          rooms: getRandomNumber(window.data.ROOMS_GUESTS_MIN_MAX.min, window.data.ROOMS_GUESTS_MIN_MAX.max),
          guests: getRandomNumber(window.data.ROOMS_GUESTS_MIN_MAX.min, window.data.ROOMS_GUESTS_MIN_MAX.max),
          checkin: getRandomArrayItem(offersInfo.checkinout),
          checkout: getRandomArrayItem(offersInfo.checkinout),
          features: getRandomElementsArray(offersInfo.features),
          description: '',
          photos: []
        },
        location: {
          x: x,
          y: y
        }
      };
  }
  return allOffersArray;
};

// собираем массив allOffersArray из реальных данных
var allOffersArray = createallOffersArrayArray(window.data.NUMBER_OF_OFFERS, window.data.OFFERS_INFO);

// заводим переменную для активного попапа с карточкой
var activePopup = null;

// заводим переменную для активного пина
var activePin = null;

// что происходит при закрытии карточки
var closePopup = function () {
  activePin.classList.remove('map__pin--active');
  var popupCloseButton = activePopup.querySelector('.popup__close');
  popupCloseButton.removeEventListener('click', popupCloseButtonClickHandler);
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

// что происходит при открытии пина
var pinClickHandler = function (evt) {

  var showPopup = function () {
    var pinData = evt.currentTarget.pinData;
    activePin = evt.currentTarget;
    activePopup = createActiveOffer(pinData, offerTemplate);
    activePin.classList.add('map__pin--active');
    var popupCloseButton = activePopup.querySelector('.popup__close');

    // слушаем клики
    popupCloseButton.addEventListener('click', closePopup);
    map.addEventListener('keydown', popupCloseButtonClickHandler);
    popupCloseButton.addEventListener('keydown', popupCloseButtonClickHandler);
  };

  // если карточки на экране нет
  if (activePopup === null) {
    showPopup();

  // если карточка на экране уже есть
  } else {
    closePopup();
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

// создаем события для шелчка по главному Пину
var mainPinMouseupHandler = function () {
  mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
  createAllPins(allOffersArray);
  document.querySelector('.map').classList.remove('map--faded');
  window.form.enableForm();
};

// щелкаем по главному пину
mainPin.addEventListener('mouseup', mainPinMouseupHandler);

// форма доступна для заполнения
