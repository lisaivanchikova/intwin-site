/* Intwin Partners — navigation behaviour. No dependencies. */
(function () {
  'use strict';

  var nav = document.querySelector('nav.main');
  var burger = document.querySelector('.burger');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  var pointerNav = window.matchMedia('(min-width: 961px) and (hover: hover)');
  var items = Array.prototype.slice.call(document.querySelectorAll('.navitem'));

  items.forEach(function (item) {
    var btn = item.querySelector('.navtoggle');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = item.classList.contains('open');
      items.forEach(function (i) {
        i.classList.remove('open');
        var b = i.querySelector('.navtoggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Hover opens the menu on pointer devices with room for it. The query is
    // read at event time, so narrowing a desktop window hands control back to
    // the chevron button instead of leaving a stale listener fighting it.
    item.addEventListener('mouseenter', function () {
      if (!pointerNav.matches) return;
      items.forEach(function (i) { i.classList.remove('open'); });
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', function () {
      if (!pointerNav.matches) return;
      item.classList.remove('open');
    });
  });

  document.addEventListener('click', function () {
    items.forEach(function (i) {
      i.classList.remove('open');
      var b = i.querySelector('.navtoggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    items.forEach(function (i) { i.classList.remove('open'); });
    if (nav) nav.classList.remove('open');
  });
})();

/* Sticky call to action, phones only. It appears once the header CTA has
   scrolled out of reach and stands down while the form is on screen, so it
   never sits on top of the thing it is asking you to use. */
(function () {
  'use strict';

  var cta = document.querySelector('.stickycta');
  if (!cta) return;

  var target = document.querySelector(cta.getAttribute('href') || '');
  var atTarget = false;

  if (target && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      atTarget = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px -35% 0px' }).observe(target);
  }

  function update() {
    var past = window.pageYOffset > 420;
    cta.classList.toggle('show', past && !atTarget);
  }

  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }, { passive: true });

  update();
})();
