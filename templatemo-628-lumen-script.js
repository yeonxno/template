/*
  Lumen Eighty Template
  https://templatemo.com/tm-628-lumen-eighty
*/

(function () {
  'use strict';

  /* ============ SPA ROUTER ============ */
  var pages = document.querySelectorAll('.page');
  var routeLinks = document.querySelectorAll('[data-route]');
  var navLinks = document.querySelectorAll('.main-nav .nav-link, .mobile-nav .m-link[data-route]');
  var validRoutes = ['home', 'catalogue', 'atelier', 'inquire'];
  var currentRoute = null;
  var transitioning = false;

  function updateHash(route) {
    /* Sandboxed iframes block the History API, so fail silently and route in memory */
    try {
      history.replaceState(null, '', '#' + route);
    } catch (err) {
      try { location.hash = route; } catch (err2) { /* fully sandboxed, in-memory routing only */ }
    }
  }

  function setActiveNav(route) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-route') === route);
    });
  }

  function showPage(route, anchor) {
    var target = document.getElementById('page-' + route);
    if (!target) return;
    pages.forEach(function (p) { p.classList.remove('active'); });
    target.classList.add('active');
    setActiveNav(route);
    currentRoute = route;
    observeReveals(target);
    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) {
        var top = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: top, behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function navigate(route, anchor, pushHash) {
    if (validRoutes.indexOf(route) === -1) route = 'home';
    if (transitioning) return;
    if (route === currentRoute) {
      if (anchor) {
        var el = document.getElementById(anchor);
        if (el) {
          var top = el.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
      if (pushHash !== false) updateHash(route);
      return;
    }
    var current = document.getElementById('page-' + currentRoute);
    if (pushHash !== false) updateHash(route);
    if (current) {
      transitioning = true;
      current.style.transition = 'opacity 0.3s ' + 'cubic-bezier(0.16, 1, 0.3, 1)' + ', transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      current.style.opacity = '0';
      current.style.transform = 'translateY(-16px)';
      setTimeout(function () {
        current.style.transition = '';
        current.style.opacity = '';
        current.style.transform = '';
        transitioning = false;
        showPage(route, anchor);
      }, 300);
    } else {
      showPage(route, anchor);
    }
  }

  routeLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var route = link.getAttribute('data-route');
      var anchor = link.getAttribute('data-anchor');
      closeMobileNav();
      navigate(route, anchor);
    });
  });

  window.addEventListener('hashchange', function () {
    var route = location.hash.replace('#', '') || 'home';
    if (route !== currentRoute) navigate(route, null, false);
  });

  /* ============ REVEAL ON SCROLL ============ */
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }

  function observeReveals(scope) {
    var items = (scope || document).querySelectorAll('.reveal:not(.visible)');
    items.forEach(function (item) {
      if (observer) { observer.observe(item); } else { item.classList.add('visible'); }
    });
  }

  /* Mandatory fallback so content is never hidden in iframe previews */
  setTimeout(function () {
    document.querySelectorAll('.page.active .reveal:not(.visible)').forEach(function (item) {
      item.classList.add('visible');
    });
  }, 3000);

  /* ============ MOBILE NAV ============ */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    menuToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.m-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = btn.closest('li').querySelector('.m-sub');
      var isOpen = sub.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.querySelector('.caret').style.transform = isOpen ? 'rotate(225deg)' : 'rotate(45deg)';
    });
  });

  /* ============ DESKTOP DROPDOWN KEYBOARD SUPPORT ============ */
  document.querySelectorAll('.has-drop').forEach(function (item) {
    var trigger = item.querySelector('.nav-link');
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        item.classList.add('drop-open');
        var first = item.querySelector('.dropdown a');
        if (first) first.focus();
      }
      if (e.key === 'Escape') item.classList.remove('drop-open');
    });
    item.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!item.contains(document.activeElement)) item.classList.remove('drop-open');
      }, 10);
    });
  });

  /* ============ INQUIRY FORM ============ */
  var form = document.getElementById('inquireForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    note.classList.add('show');
    form.reset();
  });

  /* ============ INIT ============ */
  document.getElementById('year').textContent = new Date().getFullYear();
  var initial = location.hash.replace('#', '');
  if (validRoutes.indexOf(initial) === -1) initial = 'home';
  showPage(initial, null);
})();
