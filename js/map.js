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

var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
var getRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getFeatures = function () {
  var features = [];
  for (var i = 0; i < getRandomArbitary(1, 5); i++) {
    features[i] = OFFERS_INFO.features[getRandomArbitary(1, 5)];
  }
  return features;
};

var createNearByArray = function (numberOfOffers, offersInfo) {
  var nearBy = [];
  for (var i = 0; i < numberOfOffers; i++) {
    nearBy[i] =
      {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: getRandomValue(offersInfo.title),
          // address: nearBy[i].location.x + ' ' + nearBy[i].location.y,
          price: getRandomArbitary(1000, 1000000),
          type: getRandomValue(offersInfo.type),
          rooms: getRandomArbitary(1, 5),
          guests: getRandomArbitary(1, 5),
          checkin: getRandomValue(offersInfo.checkinout),
          checkout: getRandomValue(offersInfo.checkinout),
          features: getFeatures(),
          description: '',
          photos: []
        },
        location: {
          x: getRandomArbitary(300, 900) + PIN_HALF_WIDTH,
          y: getRandomArbitary(100, 500) + PIN_HEIGHT
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
for (var i = 0; i < nearBy.length; i++) {
  var getPin = pinTemplate.cloneNode(true);

  getPin.style.left = nearBy[i].location.x + 'px';
  getPin.style.top = nearBy[i].location.y + 'px';
  getPin.querySelector('img').src = nearBy[i].author.avatar;

  mapPins.appendChild(getPin);
}
var getOffer = offerTemplate.cloneNode(true);

getOffer.querySelector('h3').textContent = nearBy[0].offer.title;
getOffer.querySelector('small').textContent = nearBy[0].offer.address;
getOffer.querySelector('.popup__price').textContent = nearBy[0].offer.price + '₽/ночь';
getOffer.querySelector('h4').textContent = nearBy[0].offer.type[1];

getOffer.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + nearBy[0].offer.checkin + ', выезд до ' + nearBy[0].offer.checkout;
getOffer.querySelector('p:nth-of-type(5)').textContent = nearBy[0].offer.description;
getOffer.querySelector('img').src = nearBy[0].author.avatar;

// var popupFeatures = document.querySelector('.popup__features');
for (var j = 0; i < nearBy[0].offer.features.length; j++) {
  getOffer.querySelector('.popup__features').insertAdjacentHTML('afterbegin', '<li class="features--' + nearBy[0].offer.features[j] + '">test</li>');
}

map.appendChild(getOffer);

document.querySelector('.map').classList.remove('map--faded');
