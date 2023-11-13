(function () {
  function lazyImageInit(conf) {
    // Add Style To Head
    var head = document.querySelector('head');
    var style = document.createElement('style');
    style.innerText =
      'img[data-lazy=true] {' +
      'transition: ' +
      conf.transProp +
      ' ' +
      conf.transDuration +
      's ' +
      conf.transType +
      ';' +
      '-moz-transition: ' +
      conf.transProp +
      ' ' +
      conf.transDuration +
      's ' +
      conf.transType +
      ';' +
      '-webkit-transition: ' +
      conf.transProp +
      ' ' +
      conf.transDuration +
      's ' +
      conf.transType +
      ';' +
      '-o-transition: ' +
      conf.transProp +
      ' ' +
      conf.transDuration +
      's ' +
      conf.transType +
      ';}';
    head.appendChild(style);

    // Process when in viewport
    function checkImagePosition() {
      // Get All Image Tag
      var imgs = document.querySelectorAll('img[data-src]');

      // Process Image One By One
      imgs.forEach(function (img) {
        // Get Window Height
        var windowHeight = window.innerHeight;

        // Process It
        loadImage(img);
        hideImage(img);
      });
    }

    // Load The Image
    function loadImage(img) {
      var src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
      img.src = src;
    }

    // Hide First
    function hideImage(img) {
      var greyPic =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAACKaQAAimkBsWWzMgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAYSURBVBiVY3z27Nl/BiIAEzGKRhVSTyEA8gMDxYLXl28AAAAASUVORK5CYII=';

      img.onload = function () {
        // Set the Size
        var height = img.clientHeight;
        var width = img.clientWidth;

        // Save the original
        img.setAttribute('data-original', img.src);

        // Loading State of Image
        img.style.width = width + 'px';
        img.style.height = height + 'px';

        if (img.src !== greyPic) img.src = greyPic;
        img.onload = null;
      };

      img.setAttribute('data-lazy', false);
    }

    // Process when in viewport
    function checkLoadedImagePosition() {
      // Get All Image Tag
      var imgs = document.querySelectorAll('img[data-lazy=false]');

      // Process Image One By One
      imgs.forEach(function (img) {
        // Get Window Height
        var windowHeight = window.innerHeight;

        // Get All Information about image
        var imgPos = img.getBoundingClientRect();
        var onCenterViewPort = imgPos.top + windowHeight / 2 < windowHeight;

        if (onCenterViewPort) showImage(img);
      });
    }

    // Show Fade In Effect and remove event listener~
    function showImage(img) {
      // For Fade Effect
      img.style.opacity = 0;

      setTimeout(function () {
        img.style.opacity = 1;
        img.src = img.getAttribute('data-original');
        img.setAttribute('data-lazy', true);

        // Make the size Responsive Again
        img.style.width = null;
        img.style.height = null;
      }, 100);
    }

    function hasImageLoaded(img) {
      var loaded = img.complete;
      var repeat = function () {
        return setTimeout(function () {
          hasImageLoaded(img);
        }, 300);
      };
      return loaded ? loaded : repeat();
    }

    // Initial Checking
    checkImagePosition();

    // Add Event Listener To Window
    window.addEventListener('scroll', function () {
      checkImagePosition();
      checkLoadedImagePosition();
    });
  }

  // Export as a module or to the global scope
  if (typeof module === 'object' && module.exports) {
    module.exports = lazyImageInit;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return lazyImageInit;
    });
  } else if (typeof window !== 'undefined') {
    window.lazyImageInit = lazyImageInit;
  }
})();
