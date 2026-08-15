// Offline & Filter-proof PokiSDK Mock for Stickman Hook
(function() {
  'use strict';

  var PokiSDK = {
    init: function() {
      return Promise.resolve(true);
    },
    initWithVideoHB: function() {
      return Promise.resolve(true);
    },
    setDebug: function() {},
    setDebugTouchOverlayController: function() {},
    gameLoadingStart: function() {},
    gameLoadingProgress: function() {},
    gameLoadingFinished: function() {},
    gameplayStart: function() {},
    gameplayStop: function() {},
    happyTime: function() {},
    commercialBreak: function() {
      return Promise.resolve(true);
    },
    rewardedBreak: function() {
      return Promise.resolve(true);
    },
    displayAd: function() {},
    destroyAd: function() {},
    getLeaderboard: function() {
      return Promise.resolve([]);
    },
    captureError: function() {}
  };

  window.PokiSDK = PokiSDK;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PokiSDK;
  }
})();
