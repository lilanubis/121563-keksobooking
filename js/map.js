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

var MIN_PRICES_PER_TYPE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
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
var timeInInput = document.querySelector('#timein');
var timeOutInput = document.querySelector('#timeout');
var accomodationTypeSelect = document.querySelector('#type');
var accomodationPriceInput = document.querySelector('#price');
var roomNumberSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');

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
  if (event.keyCode === ESC_KEYCODE || event.keyCode === ENTER_KEYCODE) {
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
  if (evt.target === ENTER_KEYCODE) {
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
  createAllPins(nearBy);
  document.querySelector('.map').classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  for (var j = 0; j < fieldsets.length; j++) {
    fieldsets[j].removeAttribute('disabled', 'disabled');
  }
};

// щелкаем по главному пину
mainPin.addEventListener('mouseup', mainPinMouseupHandler);

// форма доступна для заполнения

// синхронизируем время заезда и выезда
// обработчик события на инпут времени въезда
var timeInInputHandler = function () {
  timeOutInput.value = timeInInput.value;
};
// обработчик события на инпут времени въезда
var timeOutInputHandler = function () {
  timeInInput.value = timeOutInput.value;
};

// слушаем изменения в инпуте времени въезда
timeInInput.addEventListener('input', timeInInputHandler);

// слушаем изменения в инпуте времени выезда
timeOutInput.addEventListener('input', timeOutInputHandler);

// синхронизируем тип жилья с ценой
// обработчик события на селект с типом жилья
var accomodationTypeSelectSelectHandler = function () {
  if (accomodationTypeSelect.value === 'bungalo') {
    accomodationPriceInput.setAttribute('min', MIN_PRICES_PER_TYPE.bungalo);
  } else if (accomodationTypeSelect.value === 'flat') {
    accomodationPriceInput.setAttribute('min', MIN_PRICES_PER_TYPE.flat);
  } else if (accomodationTypeSelect.value === 'house') {
    accomodationPriceInput.setAttribute('min', MIN_PRICES_PER_TYPE.house);
  } else {
    accomodationPriceInput.setAttribute('min', MIN_PRICES_PER_TYPE.palace);
  }
};

// слушаем изменения в селекте жилья
accomodationTypeSelect.addEventListener('input', accomodationTypeSelectSelectHandler);

// синхронизируем количество комнат с количеством гостей
// обработчик события на селект с количеством комнат
var roomNumberSelectSelectHadler = function () {
  if (roomNumberSelect.value === '1') {
    capacitySelect.options[0].disabled = true;
    capacitySelect.options[1].disabled = true;
    capacitySelect.options[2].disabled = false;
    capacitySelect.options[3].disabled = true;
  } else if (roomNumberSelect.value === '2') {
    capacitySelect.options[0].disabled = false;
    capacitySelect.options[1].disabled = false;
    capacitySelect.options[2].disabled = true;
    capacitySelect.options[3].disabled = true;
  } else if (roomNumberSelect.value === '3') {
    capacitySelect.options[0].disabled = false;
    capacitySelect.options[1].disabled = false;
    capacitySelect.options[2].disabled = false;
    capacitySelect.options[3].disabled = true;
  } else {
    capacitySelect.options[0].disabled = true;
    capacitySelect.options[1].disabled = true;
    capacitySelect.options[2].disabled = true;
    capacitySelect.options[3].disabled = false;
  }
};

// слушаем измнения в селекте кол-ва комнат
roomNumberSelect.addEventListener('input', roomNumberSelectSelectHadler);
