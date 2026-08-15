// Clean Offline PokiSDK Mock for Monkey Mart
(function(window) {
  'use strict';

  function PokiSDK() {}

  PokiSDK.prototype.init = function() {
    return Promise.resolve();
  };

  PokiSDK.prototype.initWithVideoHB = function() {
    return Promise.resolve();
  };

  PokiSDK.prototype.customEvent = function() {};

  PokiSDK.prototype.setDebug = function() {};

  PokiSDK.prototype.setDebugTouchOverlayController = function() {};

  PokiSDK.prototype.isAdBlocked = function() {
    return false;
  };

  PokiSDK.prototype.happyTime = function() {};

  PokiSDK.prototype.gameLoadingStart = function() {};

  PokiSDK.prototype.gameLoadingProgress = function() {};

  PokiSDK.prototype.gameLoadingFinished = function() {};

  PokiSDK.prototype.gameplayStart = function() {};

  PokiSDK.prototype.gameplayStop = function() {};

  PokiSDK.prototype.commercialBreak = function() {
    return Promise.resolve();
  };

  PokiSDK.prototype.rewardedBreak = function() {
    return Promise.resolve(true);
  };

  PokiSDK.prototype.displayAd = function() {};

  PokiSDK.prototype.destroyAd = function() {};

  PokiSDK.prototype.getURLParam = function() {
    return "";
  };

  PokiSDK.prototype.captureError = function() {};

  PokiSDK.prototype.shareableURL = function() {
    return Promise.resolve(window.location.href);
  };

  window.PokiSDK = new PokiSDK();
})(window);
