'use strict';

(function () {
  // переменные элементов в доме, которые нужны только для формы
  var noticeForm = document.querySelector('.notice__form');
  var submit = noticeForm.querySelector('.form__submit');
  var inputs = noticeForm.querySelectorAll('input');
  var timeInInput = noticeForm.querySelector('#timein');
  var timeOutInput = noticeForm.querySelector('#timeout');
  var accommodationTypeSelect = noticeForm.querySelector('#type');
  var accommodationPriceInput = noticeForm.querySelector('#price');
  var roomNumberSelect = noticeForm.querySelector('#room_number');
  var accommodationAddress = noticeForm.querySelector('#address');
  var capacitySelect = noticeForm.querySelector('#capacity');
  var fieldsets = noticeForm.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var housingType = map.querySelector('#housing-type');
  var housingPrice = map.querySelector('#housing-price');
  var housingRooms = map.querySelector('#housing-rooms');
  var housingGuests = map.querySelector('#housing-guests');
  var housingFeatures = map.querySelector('#housing-features');
  var filters = [];

  // debounce
  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, window.data.TIMEOUT_DEBOUNCE);
  };

  var selectStateChanged = function (target) {
    if (target.value !== 'any') {
      var isFilterExist = filters.find(function (filterObj) {
        var isFound;
        if (filterObj.id === target.id) {
          filterObj.value = target.value;
          isFound = true;
        } else {
          isFound = false;
        }
        return isFound;
      });

      if (!isFilterExist) {
        filters.push({
          id: target.id,
          value: target.value
        });
      }
    } else {
      filters = filters.filter(function (filterObject) {
        return filterObject.id !== target.id;
      });
    }
  };
  var featureStateChanged = function (currentTarget) {
    var featureInputs = currentTarget.querySelectorAll('input');
    var featureFilterObject = {
      id: currentTarget.id,
      features: []
    };
    Array.from(featureInputs).forEach(function (input) {
      featureFilterObject.features.push({
        featureName: input.value,
        checked: input.checked
      });
    });

    var isFeaturesFilterExist = filters.find(function (filterObj) {
      if (filterObj.id === currentTarget.id) {
        filterObj.features = featureFilterObject.features;
        return true;
      } else {
        return false;
      }
    });
    if (!isFeaturesFilterExist) {
      filters.push(featureFilterObject);
    }
  };

  var updateFilter = function (evt) {
    var target = evt.target;
    var currentTarget = evt.currentTarget;
    if (currentTarget.id !== 'housing-features') {
      selectStateChanged(target);
    } else {
      featureStateChanged(currentTarget);
    }

    window.card.closeCard();
    window.pin.deleteAllPins();
    debounce(window.pin.renderPins);
  };

  housingType.addEventListener('change', updateFilter);
  housingPrice.addEventListener('change', updateFilter);
  housingRooms.addEventListener('change', updateFilter);
  housingGuests.addEventListener('change', updateFilter);
  housingFeatures.addEventListener('change', updateFilter);

  // сделаем все поля формы disabled изначально
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', 'disabled');
  }

  // синхронизируем тип жилья с ценой
  var syncValueWithMin = function (input, value) {
    input.setAttribute('min', value);
  };

  function syncValues(element, value) {
    element.value = value;
  }

  // синхронизируем время заезда и выезда
  // обработчик события на инпут времени въезда и выезда
  var timeInOutInputHandler = function (evt) {
    var mainInput;
    var dependetInput;
    if (evt.target === timeOutInput) {
      mainInput = timeOutInput;
      dependetInput = timeInInput;
    } else {
      mainInput = timeInInput;
      dependetInput = timeOutInput;
    }
    window.synchronizeFields(mainInput, dependetInput, window.data.OFFERS_INFO.checkinouts, window.data.OFFERS_INFO.checkinouts, syncValues);
  };
  // слушаем изменения в инпуте времени въезда
  timeInInput.addEventListener('input', timeInOutInputHandler);

  // слушаем изменения в инпуте времени выезда
  timeOutInput.addEventListener('input', timeInOutInputHandler);

  // добавим дату в переменные для краткости
  var prices = window.data.MIN_PRICES_PER_TYPE.prices;
  var accommodations = window.data.MIN_PRICES_PER_TYPE.accommodations;

  // обработчик события на селект с типом жилья
  var accommodationTypeSelectHandler = function () {
    window.synchronizeFields(accommodationTypeSelect, accommodationPriceInput, accommodations, prices, syncValueWithMin);
  };

  // слушаем изменения в селекте жилья
  accommodationTypeSelect.addEventListener('input', accommodationTypeSelectHandler);

  // синхронизируем количество комнат с количеством гостей
  // обработчик события на селект с количеством комнат
  var roomNumberSelectHandler = function () {
    synchronizeGuestsToRoomsCount();
  };

  var synchronizeGuestsToRoomsCount = function () {
    var roomCount = roomNumberSelect.value;
    var suitableCapacity = window.data.ROOM_CAPACITY[roomCount];
    var options = capacitySelect.options;
    var hasSelected = false;

    for (i = 0; i < options.length; i++) {
      var currentOption = options[i];
      var currentOptionValue = currentOption.value;
      var isDisabled = suitableCapacity.indexOf(currentOptionValue) === -1;
      currentOption.selected = false;
      currentOption.disabled = isDisabled;
      if (!isDisabled && !hasSelected) {
        currentOption.selected = true;
        hasSelected = true;
      }
    }
  };

  roomNumberSelect.addEventListener('input', roomNumberSelectHandler);

  //  проверяем валидность формы
  // объявление функции, проверяющей валидность
  var formIsValid;
  var checkValidity = function () {
    for (i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.checkValidity() === false) {
        input.style.borderColor = '#ff6d51';
        formIsValid = false;
        break;
      } else if (input.checkValidity() === true) {
        formIsValid = true;
        input.style.borderColor = 'transparent';
      }
    }
    return formIsValid;
  };

  // эта функция будет сбрасывать дату у формы
  var onLoad = function () {
    noticeForm.reset();
    accommodationTypeSelectHandler();
  };
  var onError = function (errorMessage) {
    window.backend.showErrorMessage(errorMessage);
  };

  // обработчик события для отправки формы
  var onSubmitClick = function (evt) {
    checkValidity();
    if (formIsValid) {
      evt.preventDefault();
      window.backend.save(new FormData(noticeForm), onLoad, onError);
    }
  };

  submit.addEventListener('click', onSubmitClick);

  // функция для показа формы (для использования при клике по главному пину)
  var enableForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    synchronizeGuestsToRoomsCount();
    window.synchronizeFields(accommodationTypeSelect, accommodationPriceInput, accommodations, prices, syncValueWithMin);
    for (i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled', 'disabled');
    }
  };

  window.form = {
    enableForm: enableForm,
    setAddressCoordinates: function (x, y) {
      accommodationAddress.value = 'x: ' + x + ', y: ' + y;
    },
    getCurrentFilters: function () {
      return filters;
    }
  };
})();
