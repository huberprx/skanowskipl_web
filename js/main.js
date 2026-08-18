(function () {
  const tours = [
    {
      id: "zielona",
      geo: "51.9216° N  15.4709° E",
      maps: "https://maps.app.goo.gl/9R1YcJJwN2KxwYYcA",
      heading: 142.94,
      lat: 51.9216071,
      lng: 15.4708609,
      panoId: "CIHM0ogKEICAgID3or-F3wE",
      embed:
        "https://www.google.com/maps/embed?pb=!4v1787051533214!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDNvci1GM3dF!2m2!1d51.92160707270759!2d15.47086086317654!3f142.94173095129278!4f15.322415445876473!5f0.788825404718735",
    },
  ];

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const boot = document.getElementById("boot");
  function hideBoot() {
    if (!boot || boot.dataset.gone) return;
    boot.dataset.gone = "1";
    if (window.gsap) {
      gsap.to(boot, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: function () {
          boot.remove();
        },
      });
    } else boot.remove();
  }
  if (document.readyState === "complete") hideBoot();
  else {
    document.addEventListener("DOMContentLoaded", hideBoot);
    window.addEventListener("load", hideBoot);
  }
  setTimeout(hideBoot, 1600);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null;

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.07 });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
  }

  function scrollToEl(el) {
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      (window.scrollY || document.documentElement.scrollTop || 0) -
      88;
    if (lenis) {
      if (typeof lenis.start === "function") lenis.start();
      lenis.scrollTo(top, { duration: reduceMotion ? 0 : 1.2, force: true });
    } else {
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  function scrollToId(id) {
    if (id === "top") {
      if (lenis) {
        if (typeof lenis.start === "function") lenis.start();
        lenis.scrollTo(0, { duration: reduceMotion ? 0 : 1.2, force: true });
      } else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    scrollToEl(document.getElementById(id));
  }

  document.querySelectorAll('.bar a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = (link.getAttribute("href") || "").slice(1);
      if (!id) return;
      e.preventDefault();
      closeMenu();
      scrollToId(id);
    });
  });

  const bar = document.querySelector(".bar");
  const menuBtn = document.querySelector(".bar__menu");

  function closeMenu() {
    if (!bar || !menuBtn) return;
    bar.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Otwórz menu");
  }

  function toggleMenu() {
    if (!bar || !menuBtn) return;
    const open = !bar.classList.contains("is-open");
    bar.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 800) closeMenu();
  });

  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.body.classList.add("fine");
    window.addEventListener("pointermove", function (e) {
      cursor.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
    });
  }

  const pano = document.getElementById("pano");

  function walkUrl(tour) {
    if (tour.embed) return tour.embed;
    return (
      "https://www.google.com/maps?layer=c&panoid=" +
      encodeURIComponent(tour.panoId) +
      "&cbll=" +
      tour.lat +
      "," +
      tour.lng +
      "&cbp=12," +
      tour.heading +
      ",0,0,0&output=svembed"
    );
  }

  function show(tour) {
    document.getElementById("cap-geo").textContent = tour.geo;
    document.getElementById("cap-maps").href = tour.maps;
    pano.src = walkUrl(tour);
  }

  show(tours[0]);

  document.querySelectorAll(".plate").forEach(function (plate) {
    const id = plate.getAttribute("data-tour");
    function go() {
      const tour = tours.find(function (t) {
        return t.id === id;
      });
      if (!tour) return;
      show(tour);
      scrollToId("survey");
    }
    const btn = plate.querySelector("button");
    if (btn) btn.addEventListener("click", go);
    if (!plate.querySelector("iframe")) {
      plate.querySelector(".plate__img").addEventListener("click", go);
    }
  });

  const figure = document.getElementById("figure");
  const heroPhoto = document.querySelector(".hero__still img");
  let dragging = false;
  let dragOffset = 0;
  let dragPointer = null;

  function pageMax() {
    if (lenis && typeof lenis.limit === "number" && lenis.limit > 0) {
      return Math.max(lenis.limit, 1);
    }
    return Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  }

  function pageY() {
    if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function figMin() {
    const figH = figure.offsetHeight || 85;
    const barH = (document.querySelector(".bar") || {}).offsetHeight || 44;
    const floor = 8;
    const maxY = innerHeight - figH - floor;
    const minTrack = Math.max(180, innerHeight * 0.45);
    let start = barH + 8;
    if (heroPhoto) {
      const heroBottom = heroPhoto.getBoundingClientRect().bottom + pageY();
      start = heroBottom - figH;
    }
    return Math.max(barH + 8, Math.min(start, maxY - minTrack));
  }

  function figMax() {
    return Math.max(figMin() + 1, innerHeight - (figure.offsetHeight || 85) - 8);
  }

  function figRange() {
    return Math.max(figMax() - figMin(), 1);
  }

  function jumpTo(y) {
    const next = Math.max(0, Math.min(pageMax(), y));
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, next);
    html.style.scrollBehavior = prev;
    if (lenis) lenis.scrollTo(next, { immediate: true, force: true });
  }

  function parkFigure() {
    if (dragging) return;
    const y = pageY();
    const t = Math.min(1, Math.max(0, y / pageMax()));
    figure.style.top = figMin() + t * figRange() + "px";
    figure.classList.toggle("is-walk", y > 40 && t < 0.96);
  }

  function moveToClientY(clientY) {
    const top = Math.max(figMin(), Math.min(figMax(), clientY - dragOffset));
    figure.style.top = top + "px";
    jumpTo(((top - figMin()) / figRange()) * pageMax());
  }

  function startDrag(clientY) {
    dragging = true;
    dragOffset = clientY - figure.getBoundingClientRect().top;
    figure.classList.add("is-drag", "is-walk");
    if (lenis) lenis.stop();
  }

  function stopDrag() {
    if (!dragging) return;
    dragging = false;
    figure.classList.remove("is-drag");
    if (lenis) {
      lenis.start();
      lenis.scrollTo(window.scrollY || 0, { immediate: true, force: true });
    }
    parkFigure();
  }

  figure.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });

  figure.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    dragPointer = e.pointerId;
    try {
      figure.setPointerCapture(e.pointerId);
    } catch (err) {}
    startDrag(e.clientY);
  });

  figure.addEventListener("pointermove", function (e) {
    if (!dragging || e.pointerId !== dragPointer) return;
    e.preventDefault();
    moveToClientY(e.clientY);
  });

  function endPointer(e) {
    if (e.pointerId !== dragPointer) return;
    dragPointer = null;
    try {
      figure.releasePointerCapture(e.pointerId);
    } catch (err) {}
    stopDrag();
  }

  figure.addEventListener("pointerup", endPointer);
  figure.addEventListener("pointercancel", endPointer);
  figure.addEventListener("lostpointercapture", function () {
    if (dragging) stopDrag();
  });

  window.addEventListener("scroll", parkFigure, { passive: true });
  window.addEventListener("resize", parkFigure);
  if (lenis) lenis.on("scroll", parkFigure);
  if (heroPhoto) {
    if (heroPhoto.complete) parkFigure();
    else heroPhoto.addEventListener("load", parkFigure);
  }
  parkFigure();

  if (cursor) {
    window.addEventListener("pointermove", function (e) {
      const boxes = document.querySelectorAll(
        ".instrument__frame, .plate__img--walk, .booking__frame, .figure"
      );
      let inside = false;
      boxes.forEach(function (box) {
        const r = box.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          inside = true;
        }
      });
      cursor.style.opacity = inside ? "0" : "1";
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.from(".note p", {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".note", start: "top 75%" },
    });
  }

  document.querySelectorAll(".reveal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const dd = btn.closest("dd");
      if (!dd) return;
      const open = !dd.classList.contains("is-open");
      dd.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();


