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

  // Track resource load failures
  window.addEventListener(
    "error",
    function (event) {
      var target = event.target;
      if (
        target &&
        (target.tagName === "IMG" ||
          target.tagName === "SCRIPT" ||
          target.tagName === "LINK")
      ) {
        trackError("resource-error", {
          type: target.tagName.toLowerCase(),
          src: (target.src || target.href || "").slice(0, 200),
          url: window.location.pathname,
        });
      }
    },
    true,
  );
})();
