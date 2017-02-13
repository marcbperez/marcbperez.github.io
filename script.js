var slideIn = function(elementId) {
  try {
    var element = document.getElementById(elementId);
    element.className = element.className + " " + "slide-in";
  } catch (e) {
    console.log(e)
  }
};
