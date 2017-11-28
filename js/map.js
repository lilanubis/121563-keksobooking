'use strict';

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

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
var getRandomFeaturesItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomFeatures = function (array) {
  var features = [];
  for (var i = 0; i < array.length; i++) {
    if (Math.random() < 0.5) {
      features.push(array[i]);
    }
  }
  return features;
};

var getKeyValue = function (obj, key) {
  return obj[key];
};

var createNearByArray = function (numberOfOffers, offersInfo) {
  var nearBy = [];
  for (var i = 0; i < numberOfOffers; i++) {
    var x = getRandomNumber(LOCATION_MIN_MAX.x.min, LOCATION_MIN_MAX.x.max);
    var y = getRandomNumber(LOCATION_MIN_MAX.y.min, LOCATION_MIN_MAX.y.max) - PIN_HEIGHT;
    nearBy[i] =
      {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: getRandomFeaturesItem(offersInfo.title),
          address: x + ', ' + y,
          price: getRandomNumber(PRICE_MIN_MAX.min, PRICE_MIN_MAX.max),
          type: getRandomFeaturesItem(Object.keys(offersInfo.type)),
          rooms: getRandomNumber(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
          guests: getRandomNumber(ROOMS_GUESTS_MIN_MAX.min, ROOMS_GUESTS_MIN_MAX.max),
          checkin: getRandomFeaturesItem(offersInfo.checkinout),
          checkout: getRandomFeaturesItem(offersInfo.checkinout),
          features: getRandomFeatures(offersInfo.features),
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

var createPin = function (pinData) {
  var pin = pinTemplate.cloneNode(true);

  pin.style.left = pinData.location.x + 'px';
  pin.style.top = pinData.location.y + 'px';
  pin.querySelector('img').src = pinData.author.avatar;

  return pin;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < nearBy.length; i++) {
  fragment.appendChild(createPin(nearBy[i]));
}
mapPins.appendChild(fragment);

var createOffer = function (offerData) {
  var getOffer = offerTemplate.cloneNode(true);
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
  for (var j = 0; j < firstOffer.offer.features.length; j++) {
    featuresHtmlString += '<li class="feature feature--' + firstOffer.offer.features[j] + '"></li>';
  }
  getOffer.querySelector('.popup__features').insertAdjacentHTML('afterbegin', featuresHtmlString);
  return getOffer;
};
var firstOffer = nearBy[0];
fragment.appendChild(createOffer(firstOffer));
map.insertBefore(fragment, map.children[1]);

document.querySelector('.map').classList.remove('map--faded');
