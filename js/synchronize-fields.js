'use strict';

window.synchronizeFields = function (mainElement, dependetElement, mainElementValuesArray, dependentElementValuesArray, callBack) {
  window.index = 0;
  for (var i = 0; i < mainElementValuesArray.length; i++) {
    if (mainElementValuesArray[i] === mainElement.value) {
      window.index = [i];
    }
  }
  if (typeof callback === 'function') {
    callBack();
  }
};
