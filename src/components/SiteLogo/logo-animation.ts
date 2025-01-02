import anime from 'animejs';

interface Window {
  [key: string]: any;
}

declare const window: Window;

// Initial fade in animation
export function initLogoAnimation() {
  // Reset any existing animations
  anime.remove('.site-logo-text, .site-logo-icon');

  // Initial animation
  anime.timeline({
    easing: 'easeOutExpo',
  })
  .add({
    targets: '.site-logo-text',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(100),
    duration: 1200
  })
  .add({
    targets: '.site-logo-icon',
    opacity: [0, 1],
    scale: [0.5, 1],
    rotate: [-20, 0],
    duration: 800
  }, '-=800');

  // Remove any existing event listeners
  const logo = document.querySelector('.site-logo');
  if (!logo) return;

  // Clean up old event listeners
  const oldEnterListener = logo.getAttribute('data-enter-listener');
  const oldLeaveListener = logo.getAttribute('data-leave-listener');
  if (oldEnterListener && window[oldEnterListener]) {
    logo.removeEventListener('mouseenter', window[oldEnterListener]);
  }
  if (oldLeaveListener && window[oldLeaveListener]) {
    logo.removeEventListener('mouseleave', window[oldLeaveListener]);
  }

  // Create new event listeners
  const enterHandler = () => {
    anime({
      targets: '.site-logo-text',
      scale: 1.1,
      duration: 800,
      easing: 'easeOutElastic(1, .5)'
    });
    anime({
      targets: '.site-logo-icon',
      rotate: 360,
      duration: 800,
      easing: 'easeInOutQuad'
    });
  };

  const leaveHandler = () => {
    anime({
      targets: '.site-logo-text',
      scale: 1,
      duration: 600,
      easing: 'easeOutElastic(1, .5)'
    });
    anime({
      targets: '.site-logo-icon',
      rotate: 0,
      duration: 600,
      easing: 'easeInOutQuad'
    });
  };

  // Store listeners for future cleanup
  const enterListenerId = `enter_${Math.random().toString(36).substring(7)}`;
  const leaveListenerId = `leave_${Math.random().toString(36).substring(7)}`;
  window[enterListenerId] = enterHandler;
  window[leaveListenerId] = leaveHandler;
  logo.setAttribute('data-enter-listener', enterListenerId);
  logo.setAttribute('data-leave-listener', leaveListenerId);

  // Add new event listeners
  logo.addEventListener('mouseenter', enterHandler);
  logo.addEventListener('mouseleave', leaveHandler);
}
