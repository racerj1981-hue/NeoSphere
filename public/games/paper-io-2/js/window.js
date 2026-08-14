try {
  if (window.parent && typeof window.parent.maeExportApis_ === 'function') {
    window.parent.maeExportApis_();
  }
} catch (e) {}
console.log("Paper.io 2 loaded successfully in offline mode.");
