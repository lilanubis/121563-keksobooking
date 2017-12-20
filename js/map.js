'use strict';
(function () {
  // перменные из дома
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var housingType = map.querySelector('#housing-type');
  var housingPrice = map.querySelector('#housing-price');
  var housingRooms = map.querySelector('#housing-rooms');
  var housingGuests = map.querySelector('#housing-guests');
  var housingFeatures = map.querySelector('#housing-features');

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

  // drag для главного пина
  // выносим переменные, что бы не создавать их при каждом вызове функции
  var shiftPoints;
  var startPoints;
  var mainPinCoordinates;
  var left;
  var top;
  // максимальные координаты (х у) c учетом высоты пина
  var maxYCoordinate = 500 - window.data.PIN_HEIGHT;
  var minYCoordinate = 100 - window.data.PIN_HEIGHT;
  // ограничения пина по бокам
  var minLeft = 0;
  var maxLeft = 1200;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    // начальные координаты мыши
    startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mouseMoveHandler = function (mvEvt) {
      mvEvt.preventDefault();
      // смещение
      shiftPoints = {
        x: startPoints.x - mvEvt.clientX,
        y: startPoints.y - mvEvt.clientY
      };
      // перезаписываем координаты мыши (с события mousedown) на текущие координаты
      startPoints = {
        x: mvEvt.clientX,
        y: mvEvt.clientY
      };
      // текущие координаты пина
      mainPinCoordinates = {
        x: mainPin.offsetLeft,
        y: mainPin.offsetTop
      };
      // если перетянут пин до 100пх, но напрвление следующего mouse move(shiftPoints.y < 0) вниз то перетягивает
      // второе условие: если перетянут до 100пх, и направление вверх то перетягивает
      if ((mainPinCoordinates.y > minYCoordinate || shiftPoints.y < 0) && (mainPinCoordinates.y < maxYCoordinate || shiftPoints.y > 0)) {
        left = mainPin.offsetLeft - shiftPoints.x;
        top = mainPin.offsetTop - shiftPoints.y;

        // проверяем выходит ли пин за боковые границы, если выходит то оставляем его "на границе"
        if (left < minLeft) {
          left = minLeft;
          mainPinCoordinates.x = minLeft;
        } else if (left > maxLeft) {
          left = maxLeft;
          mainPinCoordinates.x = maxLeft;
        }

        // проверяем ограничения пина по верху и низу карты
        if (top < minYCoordinate) {
          top = minYCoordinate;
          mainPinCoordinates.y = minYCoordinate;
        } else if (top > maxYCoordinate) {
          top = maxYCoordinate;
          mainPinCoordinates.y = maxYCoordinate;
        }

        mainPin.style.top = top + 'px';
        mainPin.style.left = left + 'px';

        window.form.setAddressCoordinates(left, top + window.data.PIN_HEIGHT);
      }
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });


  // var filterHousingArray = function (evt) {
  //   console.log(evt.target);
  // };

  var deleteAllPins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };
  var filteredHouses = [];
  var filteredFlats = [];
  var filteredBungalos = [];
  var filteredRooms1 = [];
  var filteredRooms2 = [];
  var filteredRooms3 = [];
  var filteredArray = [];
  var newArray = [];

  var makeFilteredArraysPerType = function () {
    for (var i = 0; i < window.mainHousingArray.length; i++) {
      if (window.mainHousingArray[i].offer.type !== 'house') {
        filteredHouses.push(i);
      }
      if (window.mainHousingArray[i].offer.type !== 'flat') {
        filteredFlats.push(i);
      }
      if (window.mainHousingArray[i].offer.type !== 'bungalo') {
        filteredBungalos.push(i);
      }
      if (window.mainHousingArray[i].offer.rooms != '1') {
        filteredRooms1.push(i);
      }
      if (window.mainHousingArray[i].offer.rooms != '2') {
        filteredRooms2.push(i);
      }
      if (window.mainHousingArray[i].offer.rooms != '3') {
        filteredRooms3.push(i);
      }
    }
  };

  // remove duplicates
// тут должна быть функция по удалению дупликатов

  // фильтрация
  var housingTypeChangeHandler = function (evt) {
    filteredArray = [];
    // debugger;
    window.arrayToComeBack = window.mainHousingArray;
    newArray = window.arrayToComeBack;
    deleteAllPins();
    makeFilteredArraysPerType();
    if (housingType.value === 'house') {
      filteredArray.push(filteredHouses);
    }
    if (housingType.value === 'flat') {
      filteredArray.push(filteredFlats);
    }
    if (housingType.value === 'bungalo') {
      filteredArray.push(filteredBungalos);
    } if (housingRooms.value === '1') {
      filteredArray.push(filteredRooms1);
    }
    // debugger;
    console.log(filteredArray);
    var arrUnique = unique(filteredArray);
    console.log(arrUnique);
    // var newArray = window.mainHousingArray;
    // var filteredArray = [];
    // var ;
    // window.pin.createAllPins(filteredArray, filteredArray.length);
  };

  housingType.addEventListener('change', housingTypeChangeHandler);
  housingPrice.addEventListener('change', housingTypeChangeHandler);
  housingGuests.addEventListener('change', housingTypeChangeHandler);
  housingRooms.addEventListener('change', housingTypeChangeHandler);
  housingFeatures.addEventListener('change', housingTypeChangeHandler);

})();
