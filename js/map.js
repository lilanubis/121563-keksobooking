'use strict';

var NUMBER_OF_OFFERS = 8;
var OFFERS_INFO = {
  title: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  type: [['flat', 'Квартира'], ['bungalo', 'Бунгало'], ['house', 'Дом']],
  checkinout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};
var PIN_HALF_WIDTH = 40 / 2;
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

var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
var getRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomArray = function (array) {
  var features = [];
  for (var i = 0; i < array.length; i++) {
    var chance = Math.random();
    if (chance < 0.5) {
      features.push(array[i]);
    }
  }
  return features;
};

var createNearByArray = function (numberOfOffers, offersInfo) {
  var nearBy = [];
  for (var i = 0; i < numberOfOffers; i++) {
    var x = getRandomArbitary(LOCATION_MIN_MAX.x.min, LOCATION_MIN_MAX.x.max) + PIN_HALF_WIDTH;
    var y = getRandomArbitary(LOCATION_MIN_MAX.y.min, LOCATION_MIN_MAX.y.max) + PIN_HEIGHT;
    nearBy[i] =
      {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: getRandomValue(offersInfo.title),
          address: x + ', ' + y,
          price: getRandomArbitary(PRICE_MIN_MAX.min, PRICE_MIN_MAX.max),
          type: getRandomValue(offersInfo.type),
          rooms: getRandomArbitary(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
          guests: getRandomArbitary(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
          checkin: getRandomValue(offersInfo.checkinout),
          checkout: getRandomValue(offersInfo.checkinout),
          features: getRandomArray(offersInfo.features),
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
var nearBy = createNearByArray(NUMBER_OF_OFFERS, OFFERS_INFO);

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');

var createPin = function () {
  var pin = pinTemplate.cloneNode(true);

  pin.style.left = nearBy[i].location.x + 'px';
  pin.style.top = nearBy[i].location.y + 'px';
  pin.querySelector('img').src = nearBy[i].author.avatar;

  return pin;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < nearBy.length; i++) {
  fragment.appendChild(createPin());
}

mapPins.appendChild(fragment);

var createOffer = function () {
  var getOffer = offerTemplate.cloneNode(true);

  getOffer.querySelector('h3').textContent = nearBy[0].offer.title;
  getOffer.querySelector('small').textContent = nearBy[0].offer.address;
  getOffer.querySelector('.popup__price').textContent = nearBy[0].offer.price + '₽/ночь';
  getOffer.querySelector('h4').textContent = nearBy[0].offer.type[1];
  // оставляю с комнатами, ибо в темплейте так, я думаю в задании просто не дописали комнаты
  getOffer.querySelector('p:nth-of-type(3)').textContent = nearBy[0].offer.rooms + ' комнаты для ' + nearBy[0].offer.guests + ' гостей';
  getOffer.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + nearBy[0].offer.checkin + ', выезд до ' + nearBy[0].offer.checkout;
  getOffer.querySelector('p:nth-of-type(5)').textContent = nearBy[0].offer.description;
  getOffer.querySelector('img').src = nearBy[0].author.avatar;

  getOffer.querySelector('.popup__features').innerHTML = '';

  for (var j = 0; j < nearBy[0].offer.features.length; j++) {
    getOffer.querySelector('.popup__features').insertAdjacentHTML('afterbegin', '<li class="feature feature--' + nearBy[0].offer.features[j] + '"></li>');
  }
  return getOffer;
};

fragment.appendChild(createOffer());
map.appendChild(fragment);

document.querySelector('.map').classList.remove('map--faded');
