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


/* Scroll progress and reveal-on-scroll, ported from Gulnar's build.
   Both are decoration, so both stand down when the visitor asks for less
   motion, and the reveal never leaves content hidden if it cannot run. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.getElementById('progbar');
  if (bar && !reduce) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - innerHeight;
        bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
        tick = false;
      });
    }, { passive: true });
  }

  var items = document.querySelectorAll('.rv');
  if (!items.length) return;
  document.documentElement.classList.add('js-rv');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  items.forEach(function (el) { io.observe(el); });
})();

/* ---------------------------------------------------------------------------
   Lead capture.

   The site is static, so a form post needs a third-party endpoint. Paste one
   into LEAD_ENDPOINT (Web3Forms, Formspree, Basin — anything that accepts a
   JSON or form POST) and every calculator on the site starts delivering to it.
   Until then the same payload opens a pre-filled mail draft, so an enquiry is
   never silently dropped on the floor.
--------------------------------------------------------------------------- */
(function () {
  var LEAD_ENDPOINT = '';
  var INBOX = 'info@intwin.tech';

  function mailtoFallback(subject, payload) {
    var body = Object.keys(payload).map(function (k) {
      return k + ': ' + payload[k];
    }).join('\n');
    window.location.href = 'mailto:' + INBOX +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  window.intwinLead = function (subject, payload, done) {
    if (!LEAD_ENDPOINT) {
      mailtoFallback(subject, payload);
      done(true, 'draft');
      return;
    }
    var data = { subject: subject };
    Object.keys(payload).forEach(function (k) { data[k] = payload[k]; });
    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      done(r.ok, r.ok ? 'sent' : 'failed');
    }).catch(function () { done(false, 'failed'); });
  };

  window.intwinGate = function (opts) {
    var input = document.getElementById(opts.input);
    var btn = document.getElementById(opts.button);
    var msg = document.getElementById(opts.message);
    if (!input || !btn || !msg) return;

    function say(text, kind) {
      msg.textContent = text;
      msg.className = 'gate-msg show ' + kind;
    }

    btn.addEventListener('click', function () {
      var email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        say('That does not look like an email address — check it and try again.', 'err');
        input.focus();
        return;
      }
      btn.disabled = true;
      var payload = opts.payload();
      payload.email = email;
      payload.page = location.pathname.replace(/^\//, '') || 'index.html';
      window.intwinLead(opts.subject, payload, function (ok, how) {
        btn.disabled = false;
        if (ok && how === 'draft') {
          say('Your mail app should be opening with everything filled in — press send and we will reply within one business day.', 'ok');
        } else if (ok) {
          say('Got it. A reply comes from a person within one business day.', 'ok');
          input.value = '';
        } else {
          say('That did not go through. Email ' + INBOX + ' directly and we will pick it up.', 'err');
        }
      });
    });
  };
})();

/* ---------------------------------------------------------------------------
   Workload estimate (home page).

   Arithmetic, not a model. Ticket volume per user per month is the published
   MSP benchmark band (0.5–1.2, with the mature end near 0.5); the deflection
   band is the 20–40% of tier-one work that MSPs report resolving without a
   person; 40 minutes is the client-side cost of a ticket, counting the person
   who raises it and the person who chases it. Every figure is shown as a range
   because a point estimate here would be a lie with a decimal place.
--------------------------------------------------------------------------- */
(function () {
  var root = document.getElementById('wl-calc');
  if (!root) return;

  var people = document.getElementById('wl-people');
  var peopleOut = document.getElementById('wl-people-out');
  var load = document.getElementById('wl-load');
  var elTickets = document.getElementById('wl-tickets');
  var elCost = document.getElementById('wl-cost');
  var elDeflect = document.getElementById('wl-deflect');
  var elHours = document.getElementById('wl-hours');

  var MIN_DEFLECT = 0.2, MAX_DEFLECT = 0.4, MINUTES = 40;
  var state = {};

  function calc() {
    var p = +people.value;
    var rate = +load.value;
    var lo = Math.round(p * rate * 0.85);
    var hi = Math.round(p * rate * 1.15);
    var costLo = Math.round(lo * MINUTES / 60);
    var costHi = Math.round(hi * MINUTES / 60);
    var defLo = Math.round(lo * MIN_DEFLECT);
    var defHi = Math.round(hi * MAX_DEFLECT);
    var backLo = Math.round(defLo * MINUTES / 60);
    var backHi = Math.round(defHi * MINUTES / 60);

    peopleOut.textContent = p + (p === 100 ? '+' : '');
    elTickets.textContent = lo + '–' + hi;
    elCost.textContent = '≈ ' + costLo + '–' + costHi + ' hrs';
    elDeflect.textContent = defLo + '–' + defHi + ' of them';
    elHours.textContent = '≈ ' + backLo + '–' + backHi + ' hrs';

    state = {
      people: p,
      week: load.options[load.selectedIndex].text,
      tickets_per_month: lo + '-' + hi,
      hours_lost_now: costLo + '-' + costHi,
      resolvable_without_a_person: defLo + '-' + defHi,
      hours_returned: backLo + '-' + backHi
    };
  }

  people.addEventListener('input', calc);
  load.addEventListener('change', calc);
  calc();

  window.intwinGate({
    input: 'wl-email',
    button: 'wl-send',
    message: 'wl-msg',
    subject: 'Workload estimate — send me the workings',
    payload: function () { return JSON.parse(JSON.stringify(state)); }
  });
})();

/* ---------------------------------------------------------------------------
   Valuation estimate (join page).

   A base multiple set by EBITDA size, then five adjustments. The base band
   comes from disclosed transaction data: sub-$5M enterprise values clear around
   5.2x and the curve only reaches 8.9x at a $38.5M median deal size, so a
   $1–5M-revenue MSP sits in the 3–6x range before anything else is considered.
   The adjustments are deliberately conservative: recurring share moves half a
   turn per ten points above sixty, where sell-side material claims up to one
   and a quarter. Every adjustment is displayed, because the point of this
   calculator is that the arithmetic is visible.
--------------------------------------------------------------------------- */
(function () {
  var root = document.getElementById('val-calc');
  if (!root) return;

  var rev = document.getElementById('v-rev');
  var ebitda = document.getElementById('v-ebitda');
  var rec = document.getElementById('v-rec');
  var recOut = document.getElementById('v-rec-out');
  var conc = document.getElementById('v-conc');
  var concOut = document.getElementById('v-conc-out');
  var growth = document.getElementById('v-growth');
  var owner = document.getElementById('v-owner');

  var elRange = document.getElementById('v-range');
  var elSub = document.getElementById('v-sub');
  var drags = document.getElementById('v-drags');
  var dragList = document.getElementById('v-drag-list');

  var state = {};

  function money(n) {
    if (n >= 1e6) {
      var m = n / 1e6;
      return '$' + (m >= 10 ? m.toFixed(1) : m.toFixed(2).replace(/0$/, '')) + 'M';
    }
    if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
    return '$' + Math.round(n);
  }

  function baseMultiple(e) {
    if (e < 150000) return 3.0;
    if (e < 300000) return 3.75;
    if (e < 600000) return 4.5;
    if (e < 1000000) return 5.25;
    if (e < 2000000) return 6.0;
    return 6.75;
  }

  function readMoney(el) {
    var n = parseFloat(String(el.value).replace(/[^0-9.]/g, ''));
    return isFinite(n) && n > 0 ? n : 0;
  }
  function writeMoney(el) {
    var n = readMoney(el);
    el.value = n ? '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '';
  }

  function calc() {
    var r = readMoney(rev);
    var e = readMoney(ebitda);
    var recPct = +rec.value;
    var concPct = +conc.value;

    recOut.textContent = recPct + '%';
    concOut.textContent = concPct + '%';

    if (!r || !e) {
      elRange.textContent = '—';
      elSub.textContent = 'Put in a revenue and an adjusted EBITDA figure and the range appears here.';
      drags.hidden = true;
      return;
    }

    var base = baseMultiple(e);
    var adj = [];

    var recAdj = Math.max(-1.5, Math.min(1.5, ((recPct - 60) / 10) * 0.5));
    if (Math.abs(recAdj) >= 0.05) {
      adj.push({
        v: recAdj,
        text: recPct >= 60
          ? recPct + '% recurring. Contracted revenue is the single thing every buyer pays up for.'
          : 'Only ' + recPct + '% recurring. Project revenue does not transfer with the business, so it is discounted.'
      });
    }

    var concAdj;
    if (concPct <= 10) concAdj = 0.4;
    else if (concPct <= 20) concAdj = 0.2;
    else if (concPct <= 30) concAdj = 0;
    else if (concPct <= 40) concAdj = -0.75;
    else concAdj = -1.5;
    if (concAdj) {
      adj.push({
        v: concAdj,
        text: concAdj > 0
          ? 'No client above ' + concPct + '% of revenue. Nothing here can walk out and take the year with it.'
          : 'One client at ' + concPct + '% of revenue. This is the defect a buyer cannot fix after closing, so it is priced hard.'
      });
    }

    var g = +growth.value;
    var gAdj = [-0.75, -0.25, 0.25, 0.6][g + 1];
    if (gAdj) {
      adj.push({
        v: gAdj,
        text: ['Revenue shrinking. A buyer is pricing the trend, not the last good year.',
               'Flat revenue. Not a penalty on its own, but nothing is paying for a premium either.',
               'Steady growth under 10% a year.',
               'Growing over 10% a year, which is what pulls a business to the top of its size band.'][g + 1]
      });
    }

    var margin = e / r;
    var mAdj = 0, mText = '';
    if (margin < 0.10) { mAdj = -0.5; mText = 'EBITDA margin under 10%. The sector average is around 11% and the top of the market runs near 20%.'; }
    else if (margin < 0.15) { mAdj = -0.15; mText = 'Margin just under the sector average of about 11%.'; }
    else if (margin < 0.20) { mAdj = 0.25; mText = 'Margin above the sector average.'; }
    else { mAdj = 0.6; mText = 'Margin over 20%, which is best-in-class for this size.'; }
    if (mAdj) adj.push({ v: mAdj, text: mText });

    var o = +owner.value;
    var oAdj = [-0.9, 0, 0.3][o + 1];
    if (oAdj) {
      adj.push({
        v: oAdj,
        text: o < 0
          ? 'You are still doing technical work. What a buyer is acquiring has to survive your last day.'
          : 'It runs without you day to day, which is what makes a clean transition possible.'
      });
    }

    var total = adj.reduce(function (a, x) { return a + x.v; }, 0);
    var m = Math.max(2.5, Math.min(8, base + total));
    var lo = e * (m - 0.6);
    var hi = e * (m + 0.6);

    elRange.textContent = money(lo) + ' – ' + money(hi);
    elSub.innerHTML = 'That is <b>' + (m - 0.6).toFixed(1) + '–' + (m + 0.6).toFixed(1) +
      '×</b> your adjusted EBITDA, or about <b>' + (lo / r).toFixed(2) + '–' +
      (hi / r).toFixed(2) + '×</b> revenue. The base for a business of this size is ' +
      base.toFixed(2).replace(/0$/, '') + '×; everything below is what your own numbers add or take away.';

    adj.sort(function (a, b) { return Math.abs(b.v) - Math.abs(a.v); });
    dragList.innerHTML = adj.slice(0, 4).map(function (x) {
      var sign = x.v > 0 ? '+' : '−';
      return '<div class="val-drag ' + (x.v > 0 ? 'up' : 'down') + '"><i>' + sign +
             Math.abs(x.v).toFixed(2).replace(/0$/, '') + '×</i><span>' + x.text + '</span></div>';
    }).join('');
    drags.hidden = adj.length === 0;

    state = {
      revenue: r,
      adjusted_ebitda: e,
      recurring_pct: recPct,
      largest_client_pct: concPct,
      growth: growth.options[growth.selectedIndex].text,
      owner_role: owner.options[owner.selectedIndex].text,
      base_multiple: base,
      adjusted_multiple: m.toFixed(2),
      indicative_range: money(lo) + ' - ' + money(hi)
    };
  }

  [rev, ebitda, rec, conc].forEach(function (el) { el.addEventListener('input', calc); });
  [rev, ebitda].forEach(function (el) {
    el.addEventListener('blur', function () { writeMoney(el); calc(); });
    el.addEventListener('focus', function () {
      var n = readMoney(el);
      el.value = n ? String(n) : '';
    });
  });
  [growth, owner].forEach(function (el) { el.addEventListener('change', calc); });
  calc();

  window.intwinGate({
    input: 'v-email',
    button: 'v-send',
    message: 'v-msg',
    subject: 'Valuation estimate — send me the written breakdown',
    payload: function () { return JSON.parse(JSON.stringify(state)); }
  });
})();
