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

  var items = Array.prototype.slice.call(document.querySelectorAll('.navitem'));

  items.forEach(function (item) {
    var btn = item.querySelector('button');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = item.classList.contains('open');
      items.forEach(function (i) {
        i.classList.remove('open');
        var b = i.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Hover opens the menu on pointer devices with room for it.
    if (window.matchMedia('(min-width: 961px)').matches) {
      item.addEventListener('mouseenter', function () {
        items.forEach(function (i) { i.classList.remove('open'); });
        item.classList.add('open');
      });
      item.addEventListener('mouseleave', function () {
        item.classList.remove('open');
      });
    }
  });

  document.addEventListener('click', function () {
    items.forEach(function (i) {
      i.classList.remove('open');
      var b = i.querySelector('button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    items.forEach(function (i) { i.classList.remove('open'); });
    if (nav) nav.classList.remove('open');
  });
})();
