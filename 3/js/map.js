'use strict';

// константы для создания объекта nearBy
var NUMBER_OF_OFFERS = 8;
var OFFERS_INFO = {
  title: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  type: {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  },
  checkinout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};
var PIN_HEIGHT = 44;
var PRICE_MIN_MAX = {
  min: 1000,
  max: 1000000
};
var ROOMS_GUESTS_MIN_MAX = {
  min: 1,
  max: 5
};
var LOCATION_MIN_MAX = {
  x: {
    min: 300,
    max: 900
  },
  y: {
    min: 100,
    max: 500
  }
};

// константы для кнопок на клаве
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// переменные для объектов, которые есть в Доме изначально
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var fieldsets = document.querySelectorAll('fieldset');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');

// сделаем все поля формы disabled изначально
for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', 'disabled');
}

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

// собираем шаблон массива NearBy
var createNearByArray = function (numberOfOffers, offersInfo) {
  var nearBy = [];
  for (var k = 0; k < numberOfOffers; k++) {
    var x = getRandomNumber(LOCATION_MIN_MAX.x.min, LOCATION_MIN_MAX.x.max);
    var y = getRandomNumber(LOCATION_MIN_MAX.y.min, LOCATION_MIN_MAX.y.max) - PIN_HEIGHT;
    nearBy[k] =
      {
        author: {
          avatar: 'img/avatars/user0' + (k + 1) + '.png'
        },
        offer: {
          title: getRandomArrayItem(offersInfo.title),
          address: x + ', ' + y,
          price: getRandomNumber(PRICE_MIN_MAX.min, PRICE_MIN_MAX.max),
          type: getRandomArrayItem(Object.keys(offersInfo.type)),
          rooms: getRandomNumber(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
          guests: getRandomNumber(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
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
  return nearBy;
};

// собираем массив NearBy из реальных данных
var nearBy = createNearByArray(NUMBER_OF_OFFERS, OFFERS_INFO);

// добавляем пустой попап
var activePopup = null;

// что происходит при открытии пина
var pinOpen = function (evt) {
  if (activePopup === null) {
    var pinData = evt.currentTarget.pinData;
    var pin = evt.currentTarget;
    activePopup = createActiveOffer(pinData, offerTemplate);
    pin.classList.add('map__pin--active');

    var popupCloseButton = activePopup.querySelector('.popup__close');

    // что происходит при закрытии карточки
    var popupRemove = function () {
      activePopup.remove();
      activePopup = null;
      pin.classList.remove('map__pin--active');
      popupCloseButton.removeEventListener('click', popupRemove);
      map.removeEventListener('keydown', popupEscHandler);
    };

    // если нажали на Esc
    var popupEscHandler = function (event) {
      if (event.keyCode === ESC_KEYCODE || event.keyCode === ENTER_KEYCODE) {
        popupRemove();
        activePopup = createActiveOffer(pinData, offerTemplate);
        pin.classList.add('map__pin--active');
      }
    };

    //  если нажали на enter на крестике
    var closePopupEnterHandler = function (event) {
      if (event.target === ENTER_KEYCODE) {
        popupRemove();
      }
    };

    // слушаем клики
    popupCloseButton.addEventListener('click', popupRemove);
    map.addEventListener('keydown', popupEscHandler);
    popupCloseButton.addEventListener('keydown', closePopupEnterHandler);

  } else {
    activePopup.remove();
    activePopup = null;
    map.querySelector('.map__pin--active').classList.remove('map__pin--active');
    pin = evt.currentTarget;
    pinData = evt.currentTarget.pinData;
    activePopup = createActiveOffer(pinData, offerTemplate);

    pin.classList.add('map__pin--active');
    popupCloseButton = activePopup.querySelector('.popup__close');
    popupCloseButton.addEventListener('click', popupRemove);
    map.addEventListener('keydown', popupEscHandler);
  }
};

// если нажали на Enter
var pinEnterHandler = function (evt) {
  if (evt.target === ENTER_KEYCODE) {
    pinOpen();
  }
};

// собираем шаблон пина
var createPin = function (pinData, template) {
  var pin = template.cloneNode(true);
  pin.style.left = pinData.location.x + 'px';
  pin.style.top = pinData.location.y + 'px';
  pin.querySelector('img').src = pinData.author.avatar;
  pin.pinData = pinData;
  pin.addEventListener('click', pinOpen);
  pin.addEventListener('keydown', pinEnterHandler);

  return pin;
};

// собираем все пины из реальных данных
var createAllPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var l = 0; l < nearBy.length; l++) {
    fragmentPin.appendChild(createPin(nearBy[l], pinTemplate));
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
  getOffer.querySelector('h4').textContent = getKeyValue(OFFERS_INFO.type, offer.type);
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
  createAllPins();
  document.querySelector('.map').classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  for (var j = 0; j < fieldsets.length; j++) {
    fieldsets[j].removeAttribute('disabled', 'disabled');
  }
};

// щелкаем по главному пину
mainPin.addEventListener('mouseup', mainPinMouseupHandler);