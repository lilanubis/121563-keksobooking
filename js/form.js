'use strict';

(function () {
  // переменные элементов в доме, которые нужны только для формы
  var noticeForm = document.querySelector('.notice__form');
  var submit = noticeForm.querySelector('.form__submit');
  var inputs = noticeForm.querySelectorAll('input');
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var accomodationTypeSelect = document.querySelector('#type');
  var accomodationPriceInput = document.querySelector('#price');
  var roomNumberSelect = document.querySelector('#room_number');
  var accomodationAddress = document.querySelector('#address');
  var capacitySelect = document.querySelector('#capacity');
  var fieldsets = document.querySelectorAll('fieldset');

  // сделаем все поля формы disabled изначально
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', 'disabled');
  }

  // синхронизируем тип жилья с ценой
  var syncValueWithMin = function (accomodationsPriceInput, value) {
    accomodationPriceInput.setAttribute('min', value);
  };

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
    function syncValues(element, value) {
      element.value = value;
    }
    window.synchronizeFields(mainInput, dependetInput, window.data.OFFERS_INFO.checkinout, window.data.OFFERS_INFO.checkinout, syncValues);
  };
  // слушаем изменения в инпуте времени въезда
  timeInInput.addEventListener('input', timeInOutInputHandler);

  // слушаем изменения в инпуте времени выезда
  timeOutInput.addEventListener('input', timeInOutInputHandler);

  // добавим дату в переменные для краткости
  var prices = window.data.MIN_PRICES_PER_TYPE.prices;
  var accomodations = window.data.MIN_PRICES_PER_TYPE.accomodations;

  // обработчик события на селект с типом жилья
  var accomodationTypeSelectHandler = function () {
    window.synchronizeFields(accomodationTypeSelect, accomodationPriceInput, accomodations, prices, syncValueWithMin);
  };

  // слушаем изменения в селекте жилья
  accomodationTypeSelect.addEventListener('input', accomodationTypeSelectHandler);

  // синхронизируем количество комнат с количеством гостей
  // обработчик события на селект с количеством комнат
  var roomNumberSelectHadler = function (evt) {
    var roomCount = evt.target.value;
    var options = capacitySelect.options;
    var hasSelected = false;

    for (var j = 0; j < options.length; j++) {
      var currentOption = options[j];
      var currentOptionValue = currentOption.value;
      var suitableCapacity = window.data.ROOM_CAPACITY[roomCount];
      var isDisabled = suitableCapacity.indexOf(currentOptionValue) === -1;
      currentOption.selected = false;
      currentOption.disabled = isDisabled;
      if (!isDisabled && !hasSelected) {
        currentOption.selected = true;
        hasSelected = true;
      }
    }
  };

  roomNumberSelect.addEventListener('input', roomNumberSelectHadler);

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

  // эта функция будет сбрасывать дату у формы и тд
  var onLoad = function () {
    noticeForm.reset();
  };
  var onError = function (errorMessage) {
    showErrorMessage(errorMessage);
  };

  // обработчик события для отправки формы
  var onSubmitClick = function (evt) {
    evt.preventDefault();
    checkValidity();
    if (formIsValid) {
      window.backend.save(new FormData(noticeForm), onLoad, onError);
    }
  };

  submit.addEventListener('click', onSubmitClick);

  // сообщение об ошибке
  var showErrorMessage = function (errorMessage) {
    var errorPopup = document.createElement('div');
    errorPopup.textContent = errorMessage;
    errorPopup.style = 'position:fixed;background:rgba(255, 86, 53, 0.9);color:white;width:100%;height:40px;box-shadow: 0 5px 10px #9e1a00;text-align:center;z-index:999;padding-top:15px;font-weight:bold;';
    document.querySelector('.map').insertAdjacentElement('afterbegin', errorPopup);
    window.setTimeout(function () {
      errorPopup.remove();
    }, 5000);
  };

  // функция для показа формы (для использования при клике по главному пину)
  var enableForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    for (var j = 0; j < fieldsets.length; j++) {
      fieldsets[j].removeAttribute('disabled', 'disabled');
    }
    window.synchronizeFields(accomodationTypeSelect, accomodationPriceInput, accomodations, prices, syncValueWithMin);
  };
  window.form = {
    enableForm: enableForm,
    setAddressCoordinates: function setAddressCoordinates(x, y) {
      accomodationAddress.value = 'x: ' + x + ', y: ' + y;
    }
  };
})();
