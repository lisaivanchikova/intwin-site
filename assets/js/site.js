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
