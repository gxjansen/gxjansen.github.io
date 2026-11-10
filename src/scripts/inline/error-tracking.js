(function () {
  // Skip error tracking on localhost/dev environments
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return;
  }

  function trackError(type, data) {
    if (typeof umami !== "undefined") {
      umami.track(type, data);
    }
  }

  // Track JavaScript errors
  window.addEventListener("error", function (event) {
    if (!event.filename || event.filename.includes("extension://")) return;
    trackError("js-error", {
      message: (event.message || "Unknown error").slice(0, 200),
      file: (event.filename || "").split("/").pop() || "unknown",
      line: event.lineno || 0,
      url: window.location.pathname,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    var message = "Promise rejected";
    if (reason) {
      message = typeof reason === "string" ? reason : reason.message || message;
    }
    trackError("promise-error", {
      message: message.slice(0, 200),
      url: window.location.pathname,
    });
  });

  // Track script and stylesheet load failures. Images are left out: they
  // only fail for clients that block or abort image loads (scrapers, data
  // savers), which flooded the stats with noise. Broken image links are
  // caught by the weekly lychee run instead.
  var MAX_RESOURCE_ERRORS = 3;
  var reported = {};
  var resourceErrors = 0;
  window.addEventListener(
    "error",
    function (event) {
      var target = event.target;
      if (!target || (target.tagName !== "SCRIPT" && target.tagName !== "LINK"))
        return;
      var src = (target.src || target.href || "").slice(0, 200);
      if (!src || reported[src] || resourceErrors >= MAX_RESOURCE_ERRORS)
        return;
      reported[src] = true;
      resourceErrors++;
      trackError("resource-error", {
        type: target.tagName.toLowerCase(),
        src: src,
        url: window.location.pathname,
      });
    },
    true,
  );
})();
