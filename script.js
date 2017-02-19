'use strict';

(function () {

  var setAction = function(elements, eventName, action) {
    if (typeof elements === 'string' || elements instanceof String) {
      elements = document.getElementsByClassName(elements);
    }

    for (var i = 0; i < elements.length; i++) {
      elements[i]["on" + eventName] = action;
    }
  };

  var actionSlideIn = function() {
    var targetId = this.getAttribute("href").replace("#", "");
    var targetElement = document.getElementById(targetId);

    targetElement.className += " slide-in";
  };

  setAction("action-slide-in", "click", actionSlideIn);

})();
