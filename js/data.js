'use strict';

// константы для создания объекта offerDataList
window.data = {
  NUMBER_OF_OFFERS: 5,
  OFFERS_INFO: {
    title: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    type: {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом'
    },
    checkinout: ['12:00', '13:00', '14:00'],
    features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
  },
  PIN_HEIGHT: 44,
  PRICE_MIN_MAX: {
    min: 1000,
    max: 1000000
  },
  ROOMS_GUESTS_MIN_MAX: {
    min: 1,
    max: 5
  },
  LOCATION_MIN_MAX: {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  },
  // константы для формы
  MIN_PRICES_PER_TYPE: {
    accomodations: ['bungalo', 'flat', 'house', 'palace'],
    prices: [0, 1000, 5000, 10000]
  },
  ROOM_CAPACITY: {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  },
  // константы для кнопок на клаве
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13,
  // переменные для адресов куда грузить данные / откуда выгружать данные
  URL_SAVE: 'https://1510.dump.academy/keksobooking',
  URL_LOAD: 'https://1510.dump.academy/keksobooking/data'
};
