// Offline mock GameMonetize SDK for Paper.io 2
(function() {
  'use strict';
  
  window.sdk = {
    showBanner: function() {
      console.log("[Paper.io 2] showBanner called -> starting game");
      if (window.SDK_OPTIONS && typeof window.SDK_OPTIONS.onEvent === 'function') {
        try {
          window.SDK_OPTIONS.onEvent({ name: 'SDK_GAME_START', status: 'success' });
        } catch (e) {
          console.warn("[Paper.io 2] SDK_GAME_START error:", e);
        }
      }
    },
    requestAd: function() {
      if (window.SDK_OPTIONS && typeof window.SDK_OPTIONS.onEvent === 'function') {
        try {
          window.SDK_OPTIONS.onEvent({ name: 'SDK_GAME_START', status: 'success' });
        } catch (e) {}
      }
    },
    init: function() {},
    destroy: function() {},
    subscribe: function() {},
    broadcast: function() {}
  };

  let _options = window.SDK_OPTIONS || null;

  function notifyReady() {
    if (_options && typeof _options.onEvent === 'function') {
      try {
        _options.onEvent({ name: 'SDK_READY' });
      } catch (e) {}
      setTimeout(function() {
        try {
          _options.onEvent({ name: 'SDK_GAME_START', status: 'success' });
        } catch (e) {}
      }, 50);
    }
  }

  Object.defineProperty(window, 'SDK_OPTIONS', {
    configurable: true,
    enumerable: true,
    get: function() {
      return _options;
    },
    set: function(val) {
      _options = val;
      if (val) {
        setTimeout(notifyReady, 50);
      }
    }
  });

  // Also trigger after DOM load just in case
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(notifyReady, 100);
    });
  } else {
    setTimeout(notifyReady, 100);
  }
})();
