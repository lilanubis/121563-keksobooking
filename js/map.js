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

  // drag для главного пина
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
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
})();
