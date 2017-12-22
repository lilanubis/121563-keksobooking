'use strict';
(function () {
  // перменные из дома
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // drag для главного пина
  // выносим переменные
  var shiftPoints;
  var startPoints;
  var mainPinCoordinates;
  var left;
  var top;
  // координаты пина
  var maxYCoordinate = 500 - window.data.PIN_HEIGHT;
  var minYCoordinate = 100 - window.data.PIN_HEIGHT;

  var minLeft = 0;
  var maxLeft = 1200;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mouseMoveHandler = function (mvEvt) {
      mvEvt.preventDefault();
      shiftPoints = {
        x: startPoints.x - mvEvt.clientX,
        y: startPoints.y - mvEvt.clientY
      };
      startPoints = {
        x: mvEvt.clientX,
        y: mvEvt.clientY
      };
      mainPinCoordinates = {
        x: mainPin.offsetLeft,
        y: mainPin.offsetTop
      };
      if ((mainPinCoordinates.y > minYCoordinate || shiftPoints.y < 0) && (mainPinCoordinates.y < maxYCoordinate || shiftPoints.y > 0)) {
        left = mainPin.offsetLeft - shiftPoints.x;
        top = mainPin.offsetTop - shiftPoints.y;

        if (left < minLeft) {
          left = minLeft;
          mainPinCoordinates.x = minLeft;
        } else if (left > maxLeft) {
          left = maxLeft;
          mainPinCoordinates.x = maxLeft;
        }

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
