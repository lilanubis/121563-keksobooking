'use strict';
(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPins = map.querySelector('.map__pins');

  // что происходит при открытии пина
  var pinClickHandler = function (evt) {
    window.card.showCard(evt);
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
  var createFilteredPinsArray = function (pinsArray) {
    var currentFilters = window.form.getCurrentFilters();
    var filtered;
    var currentFilteredPins;
    for (var index = 0, len = currentFilters.length; index < len; index++) {
      if (index === 0) {
        currentFilteredPins = pinsArray;
      } else {
        if (filtered.length) {
          currentFilteredPins = filtered;
        } else {
          break;
        }
      }
      filtered = [];

      currentFilteredPins.forEach(function (pinItem) {
        currentFilters = window.form.getCurrentFilters();
        var currentFilter = currentFilters[index];
        switch (currentFilter.id) {
          case 'housing-type':
            if (pinItem.offer.type === currentFilter.value) {
              filtered.push(pinItem);
            }
            break;
          case 'housing-price':
            if (currentFilter.value === 'middle' && pinItem.offer.price >= 10000 && pinItem.offer.price <= 50000) {
              filtered.push(pinItem);
            } else if (currentFilter.value === 'low' && pinItem.offer.price < 10000) {
              filtered.push(pinItem);
            } else if (currentFilter.value === 'high' && pinItem.offer.price > 50000) {
              filtered.push(pinItem);
            }
            break;
          case 'housing-rooms':
            if (pinItem.offer.rooms === Number.parseInt(currentFilter.value, 10)) {
              filtered.push(pinItem);
            }
            break;
          case 'housing-guests':
            if (pinItem.offer.guests >= Number.parseInt(currentFilter.value, 10)) {
              filtered.push(pinItem);
            }
            break;
          case 'housing-features':
            var featureExitsInPin = true;
            for (var i = 0; i < currentFilter.features.length; i++) {
              var currentFilterFeature = currentFilter.features[i];
              if (currentFilterFeature.checked) {
                featureExitsInPin = pinItem.offer.features.indexOf(currentFilterFeature.featureName) !== -1;
                if (!featureExitsInPin) {
                  break;
                }
              }
            }

            if (featureExitsInPin) {
              filtered.push(pinItem);
            }
            break;
        }
      });
    }
    return filtered || [];
  };

  // собираем все пины из реальных данных
  var renderPins = function () {
    var currentFilters = window.form.getCurrentFilters();
    var fragmentPin = document.createDocumentFragment();
    var pinsArray = currentFilters.length ? createFilteredPinsArray(window.mainHousingArray) : window.mainHousingArray;
    var pinCount = pinsArray.length < 5 ? pinsArray.length : window.data.NUMBER_OF_OFFERS;
    for (var l = 0; l < pinCount; l++) {
      fragmentPin.appendChild(createPin(pinsArray[l], pinTemplate));
    }
    mapPins.appendChild(fragmentPin);
  };

  // обработчики
  var onLoad = function (response) {
    window.mainHousingArray = response;
    renderPins(response);
  };
  var onError = function (errorMessage) {
    window.showErrorMessage(errorMessage);
  };
  // создаем события для шелчка по главному Пину
  var mainPinMouseupHandler = function () {
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    window.backend.load(onLoad, onError);
    document.querySelector('.map').classList.remove('map--faded');
    window.form.enableForm();
  };
  var deleteAllPins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  // щелкаем по главному пину
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  window.pin = {
    renderPins: renderPins,
    deleteAllPins: deleteAllPins
  };
})();
