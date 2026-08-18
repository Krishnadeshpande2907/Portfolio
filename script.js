/* ═════════════════════════════════════════════
   KD_Portfolio — site behavior
   Sections:
     1. Theme toggle (dark / light)
     2. Typewriter hero taglines
     3. Matrix mouse trail (+ fx toggle)
     4. Mobile nav
     5. Active section highlight
     6. Footer year
   ═════════════════════════════════════════════ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Safe localStorage helpers — the site still works if storage is blocked */
  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ── 1. THEME TOGGLE ───────────────────────── */
  var themeToggle = document.getElementById('themeToggle');

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    /* The button shows the command you would run to switch AWAY from now */
    themeToggle.textContent = theme === 'dark' ? ':set bg=light' : ':set bg=dark';
    storeSet('kd-theme', theme);
    refreshTrailColors();
  }

  themeToggle.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* Sync the button label with whatever the pre-paint script chose */
  themeToggle.textContent = currentTheme() === 'dark' ? ':set bg=light' : ':set bg=dark';

  /* ── 2. TYPEWRITER HERO TAGLINES ───────────── */
  var taglines = Array.prototype.slice.call(
    document.querySelectorAll('#heroTaglines .comment')
  );

  function typeLine(el, text, done) {
    var i = 0;
    el.classList.add('typing');
    (function tick() {
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        setTimeout(tick, 26 + Math.random() * 34);
      } else {
        el.classList.remove('typing');
        if (done) done();
      }
    })();
  }

  if (reducedMotion) {
    /* Show instantly — no animation */
    taglines.forEach(function (el) {
      el.textContent = el.getAttribute('data-type-text');
    });
  } else {
    var lineIndex = 0;
    (function typeNext() {
      if (lineIndex >= taglines.length) return;
      var el = taglines[lineIndex];
      lineIndex += 1;
      typeLine(el, el.getAttribute('data-type-text'), function () {
        setTimeout(typeNext, 250);
      });
    })();
  }

  /* ── 3. MATRIX MOUSE TRAIL ─────────────────── */
  var canvas = document.getElementById('fx-canvas');
  var ctx = canvas.getContext('2d');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var trailAvailable = !reducedMotion && finePointer && !!ctx;

  var GLYPHS = 'アイウエオカキクケコサシスセソ01<>/{}[]$#*+=;:~'.split('');
  var MAX_PARTICLES = 90;
  var SPAWN_DISTANCE = 26; /* px of mouse travel between glyph spawns */

  var particles = [];
  var lastX = null;
  var lastY = null;
  var goldColor = '#f0c040';
  var greenColor = '#4ec994';
  var rafId = null;

  var fxToggle = document.getElementById('fxToggle');
  var fxOn = storeGet('kd-fx') !== 'off';

  function refreshTrailColors() {
    var styles = getComputedStyle(document.documentElement);
    goldColor = styles.getPropertyValue('--gold').trim() || goldColor;
    greenColor = styles.getPropertyValue('--green').trim() || greenColor;
  }

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '13px "JetBrains Mono", monospace';
  }

  function spawnParticle(x, y) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      char: GLYPHS[(Math.random() * GLYPHS.length) | 0],
      born: performance.now(),
      life: 650 + Math.random() * 450,       /* ms */
      vy: 18 + Math.random() * 26,           /* px per second, falling */
      color: Math.random() < 0.8 ? 'gold' : 'green'
    });
  }

  function frame(now) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      var t = (now - p.born) / p.life;
      if (t >= 1) {
        particles.splice(i, 1);
        continue;
      }
      var alpha = 0.55 * (1 - t) * (1 - t); /* ease-out fade, subtle max */
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color === 'gold' ? goldColor : greenColor;
      ctx.fillText(p.char, p.x, p.y + p.vy * ((now - p.born) / 1000));
    }
    ctx.globalAlpha = 1;

    if (particles.length > 0) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null; /* idle — no work until the mouse moves again */
    }
  }

  function ensureLoop() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function onMouseMove(e) {
    if (!fxOn) return;
    if (lastX !== null) {
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      if (dx * dx + dy * dy < SPAWN_DISTANCE * SPAWN_DISTANCE) return;
    }
    lastX = e.clientX;
    lastY = e.clientY;
    spawnParticle(e.clientX, e.clientY);
    ensureLoop();
  }

  function setFx(on) {
    fxOn = on;
    fxToggle.textContent = on ? 'fx=on' : 'fx=off';
    storeSet('kd-fx', on ? 'on' : 'off');
    if (!on) {
      particles.length = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  if (trailAvailable) {
    refreshTrailColors();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        particles.length = 0;
      }
    });
    fxToggle.addEventListener('click', function () { setFx(!fxOn); });
    setFx(fxOn); /* sets the initial label from saved preference */
  } else {
    /* Touch device or reduced motion — hide the toggle, skip the effect */
    fxToggle.style.display = 'none';
  }

  /* ── 4. MOBILE NAV ─────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Close after choosing a link */
  Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close when clicking outside */
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── 5. ACTIVE SECTION HIGHLIGHT ───────────── */
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) { a.classList.remove('active'); });
        var link = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (s) { observer.observe(s); });

  /* ── 6. FOOTER YEAR ────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
