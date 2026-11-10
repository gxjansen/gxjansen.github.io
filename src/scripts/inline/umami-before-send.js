// Umami beforeSend hook (data-before-send="umamiBeforeSend").
// Drops events from automated browsers. Reads only flags the browser already
// exposes; nothing is stored or sent, so it adds no fingerprinting.
(function () {
  var automated =
    navigator.webdriver === true ||
    /HeadlessChrome|Lighthouse|PhantomJS|Puppeteer|Playwright/i.test(
      navigator.userAgent,
    );

  window.umamiBeforeSend = function (type, payload) {
    return automated ? false : payload;
  };
})();
