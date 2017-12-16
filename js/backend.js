'use strict';

(function () {
  window.backend = {
    // функция для загрузки данных НЕ ПАШЕТ
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onLoad(xhr.response);
      });
      xhr.addEventListener('error', function () {
        onError(xhr.response);
      });
      xhr.open('GET', window.data.URL_LOAD);
      xhr.send();
    },
    // функция для отправки данных
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onLoad(xhr.response);
      });
      xhr.addEventListener('error', function () {
        onError(xhr.response);
      });

      xhr.open('POST', window.data.URL_SAVE);
      xhr.send(data);
    }
  };
})();
