(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const boot = document.getElementById("boot");
  const bootStarted = performance.now();
  let bootQueued = false;

  function hideBoot() {
    if (!boot || boot.dataset.gone || bootQueued) return;
    bootQueued = true;
    const minimum = reduceMotion ? 200 : 950;
    const wait = Math.max(0, minimum - (performance.now() - bootStarted));

    setTimeout(function () {
      if (boot.dataset.gone) return;
      boot.dataset.gone = "1";
      boot.classList.add("is-gone");
      setTimeout(function () {
        boot.remove();
      }, reduceMotion ? 0 : 500);
    }, wait);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideBoot, { once: true });
  } else hideBoot();
  setTimeout(hideBoot, 1800);

  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.07 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.addEventListener("load", function () {
      if (typeof lenis.resize === "function") lenis.resize();
    });
  }

  const bar = document.querySelector(".bar");
  const menuButton = document.querySelector(".bar__menu");

  function menuLabel(open) {
    const i18n = window.SkanowskiI18n;
    if (!i18n) return open ? "Zamknij menu" : "Otwórz menu";
    return i18n.t(open ? "nav.menuClose" : "nav.menuOpen");
  }

  function closeMenu() {
    if (!bar || !menuButton) return;
    bar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", menuLabel(false));
  }

  if (menuButton) {
    menuButton.addEventListener("click", function (event) {
      event.stopPropagation();
      const open = !bar.classList.contains("is-open");
      bar.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
      menuButton.setAttribute("aria-label", menuLabel(open));
      if (open && window.SkanowskiI18n) window.SkanowskiI18n.closePicker();
    });
  }

  function scrollToTarget(el) {
    if (!el) return;
    const top = Math.max(
      0,
      Math.round(
        el.getBoundingClientRect().top +
          (window.scrollY || document.documentElement.scrollTop || 0) -
          70
      )
    );
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.querySelectorAll('#site-nav a[href^="#"], .business-actions a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = (link.getAttribute("href") || "").replace(/^#/, "");
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      closeMenu();
      scrollToTarget(target);
    });
  });

  document.querySelectorAll(".reveal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const dd = btn.closest("dd");
      if (!dd) return;
      const open = !dd.classList.contains("is-open");
      dd.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 800) closeMenu();
  });

  if (window.SkanowskiI18n) {
    window.SkanowskiI18n.onChange(function () {
      if (!bar || !menuButton) return;
      menuButton.setAttribute(
        "aria-label",
        menuLabel(bar.classList.contains("is-open"))
      );
    });
  }
})();
