'use strict';

window.synchronizeFields = function (mainElement, dependetElement, mainElementValuesArray, dependentElementValuesArray, callBack) {
  window.index = mainElementValuesArray.indexOf(mainElement.value);
  var syncValue = dependentElementValuesArray[window.index];
  if (typeof callBack === 'function') {
    callBack(dependetElement, syncValue);
  }
};
