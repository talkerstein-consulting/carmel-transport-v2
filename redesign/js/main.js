/* Carmel Transport - homepage behaviour
   Plain JS on purpose: no framework, no build step. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- mobile menu --- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* --- sticky nav: solid once the hero starts passing under it --- */
  var topnav = document.getElementById('topnav');
  if (topnav) {
    var onScroll = function () {
      topnav.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- intake card tabs --- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.intake-tab'));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* --- swap pick up / deliver to --- */
  var swap = document.getElementById('swap');
  if (swap) {
    swap.addEventListener('click', function () {
      var from = document.getElementById('q-from');
      var to = document.getElementById('q-to');
      if (!from || !to) return;
      var held = from.value;
      from.value = to.value;
      to.value = held;
    });
  }

  /* --- counters rise once, when the strip first comes into view --- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count'));

  function runCount(el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (reduced) { el.textContent = to; return; }

    var dur = 1500;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      // ease-out cubic: fast off the line, settles onto the number
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* --- rotating word --- */
  var rot = document.getElementById('rotator');
  if (rot && !reduced) {
    var words = Array.prototype.slice.call(rot.children);
    var at = 0;

    setInterval(function () {
      var current = words[at];
      at = (at + 1) % words.length;
      var next = words[at];

      current.classList.remove('is-on');
      current.classList.add('is-out');
      next.classList.remove('is-out');
      // next frame, so the reset position applies before it slides in
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { next.classList.add('is-on'); });
      });

      setTimeout(function () { current.classList.remove('is-out'); }, 520);
    }, 2200);
  }

  /* --- FAQ: opening one closes the others --- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  faqs.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqs.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* --- back to top --- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* --- scroll reveal --- */
  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var i = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(i, 4) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* --- footer year --- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
