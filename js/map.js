'use strict';
(function () {
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

  // собираем шаблон массива allOffersArray
  var createAlloffersArray = function (numberOfOffers, offersInfo) {
    var allOffersArray = [];
    for (var k = 0; k < numberOfOffers; k++) {
      var x = getRandomNumber(window.data.LOCATION_MIN_MAX.x.min, window.data.LOCATION_MIN_MAX.x.max);
      var y = getRandomNumber(window.data.LOCATION_MIN_MAX.y.min, window.data.LOCATION_MIN_MAX.y.max) - window.data.PIN_HEIGHT;
      allOffersArray[k] = {
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
  window.allOffersArray = createAlloffersArray(window.data.NUMBER_OF_OFFERS, window.data.OFFERS_INFO);
})();
