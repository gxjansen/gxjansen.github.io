import anime from 'animejs';

// Initial fade in animation
export function initLogoAnimation() {
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

  // Hover animation
  document.querySelectorAll('.site-logo').forEach(logo => {
    logo.addEventListener('mouseenter', () => {
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
    });

    logo.addEventListener('mouseleave', () => {
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
    });
  });
}
