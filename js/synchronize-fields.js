'use strict';

(function () {
  window.synchronizeFields = function (mainElement, dependetElement, mainElementValuesArray, dependentElementValuesArray, callback) {
    var index = mainElementValuesArray.indexOf(mainElement.value);
    var syncValue = dependentElementValuesArray[index];
    if (typeof callback === 'function') {
      callback(dependetElement, syncValue);
    }
  };
})();
