'use strict';
(function () {
  var showPopup = function (evt) {
    var pinData = evt.currentTarget.pinData;
    var activePin = evt.currentTarget;
    window.card.createActiveOffer(pinData, document.querySelector('template'));
    activePin.classList.add('map__pin--active');
    document.querySelector('.map').addEventListener('keydown', window.card.popupCloseButtonKeydownHandler);
  };

  window.showCard = {
    showCard: showPopup
  };
})();
