'use strict';

(function () {
  // сообщение об ошибке
  var showErrorMessage = function (errorMessage) {
    var errorPopup = document.createElement('div');
    errorPopup.textContent = errorMessage;
    errorPopup.style = 'position:fixed;background:rgba(255, 86, 53, 0.9);color:white;width:100%;height:40px;box-shadow: 0 5px 10px #9e1a00;text-align:center;z-index:999;padding-top:15px;font-weight:bold;';
    document.querySelector('.map').insertAdjacentElement('afterbegin', errorPopup);
    window.setTimeout(function () {
      errorPopup.remove();
    }, window.data.TIMEOUT_ERROR);
  };

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.response);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000; // 10s
    return xhr;
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', window.data.URL_SAVE);
      xhr.send(data);
    },
    load: function (onSuccess, onError) {
      var xhr = setup(onSuccess, onError);

      xhr.open('GET', window.data.URL_LOAD);
      xhr.send();
    },
    showErrorMessage: showErrorMessage
  };
})();
