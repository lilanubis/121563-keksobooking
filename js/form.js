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
  var capacitySelect = document.querySelector('#capacity');
  var fieldsets = document.querySelectorAll('fieldset');

  // сделаем все поля формы disabled изначально
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', 'disabled');
  }

  // синхронизируем время заезда и выезда
  // обработчик события на инпут времени въезда
  var timeInInputHandler = function () {
    timeOutInput.value = timeInInput.value;
  };
  // обработчик события на инпут времени въезда
  var timeOutInputHandler = function () {
    timeInInput.value = timeOutInput.value;
  };

  // слушаем изменения в инпуте времени въезда
  timeInInput.addEventListener('input', timeInInputHandler);

  // слушаем изменения в инпуте времени выезда
  timeOutInput.addEventListener('input', timeOutInputHandler);

  // синхронизируем тип жилья с ценой

  // функция для обработки min-max жилья
  var setMinMaxPriceAttribute = function () {
    if (accomodationTypeSelect.value === 'bungalo') {
      accomodationPriceInput.setAttribute('min', window.data.MIN_PRICES_PER_TYPE.bungalo);
    } else if (accomodationTypeSelect.value === 'flat') {
      accomodationPriceInput.setAttribute('min', window.data.MIN_PRICES_PER_TYPE.flat);
    } else if (accomodationTypeSelect.value === 'house') {
      accomodationPriceInput.setAttribute('min', window.data.MIN_PRICES_PER_TYPE.house);
    } else {
      accomodationPriceInput.setAttribute('min', window.data.MIN_PRICES_PER_TYPE.palace);
    }
  };

  // обработчик события на селект с типом жилья
  var accomodationTypeSelectHandler = function () {
    setMinMaxPriceAttribute();
  };

  // слушаем изменения в селекте жилья
  accomodationTypeSelect.addEventListener('input', accomodationTypeSelectHandler);

  // синхронизируем количество комнат с количеством гостей
  // обработчик события на селект с количеством комнат
  var roomNumberSelectHadler = function (evt) {
    var roomCount = evt.target.value;
    var options = capacitySelect.options;
    var hasSelected = false;

    for (var j = 0; i < options.length; j++) {
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
  var checkValidity = function () {
    for (i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.checkValidity() === false) {
        input.style.borderColor = '#ff6d51';
      } else {
        input.style.borderColor = '#03f8c1';
      }
    }
  };

  // обработчик события для
  var onSubmitClick = function () {
    checkValidity();
  };

  submit.addEventListener('click', onSubmitClick);

  // функция для показа формы (для использования при клике по главному пину)
  var enableForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    for (var j = 0; j < fieldsets.length; j++) {
      fieldsets[j].removeAttribute('disabled', 'disabled');
    }
    setMinMaxPriceAttribute();
  };
  window.form = {
    enableForm: enableForm
  };
})();
