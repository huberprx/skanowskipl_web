(function () {
  const tours = [
    {
      id: "zielona",
      no: "01",
      title: "Leśna ścieżka",
      place: "Nadleśnictwo Zielona Góra",
      geo: "51.9217° N  15.4712° E",
      maps: "https://maps.app.goo.gl/nxefdYR7dACwcZRd8",
      heading: 137.82,
      lat: 51.9216693,
      lng: 15.4712135,
      panoId: "CIHM0ogKEICAgID3or-Icg",
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
    if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.2 });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  function scrollToId(id) {
    if (id === "top") {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    scrollToEl(document.getElementById(id));
  }

  document.querySelectorAll('.bar a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = (link.getAttribute("href") || "").slice(1);
      if (!id) return;
      e.preventDefault();
      scrollToId(id);
    });
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
    document.getElementById("cap-no").textContent = tour.no;
    document.getElementById("cap-title").textContent = tour.title;
    document.getElementById("cap-place").textContent = tour.place;
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
  const figTopMin = 88;
  let dragging = false;
  let dragOffset = 0;

  function pageMax() {
    if (lenis && typeof lenis.limit === "number" && lenis.limit > 0) {
      return Math.max(lenis.limit, 1);
    }
    return Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  }

  function figMin() {
    return figTopMin;
  }

  function figMax() {
    return Math.max(figMin() + 1, innerHeight - (figure.offsetHeight || 85) - 8);
  }

  function figRange() {
    return Math.max(figMax() - figMin(), 1);
  }

  function pageY() {
    if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function jumpTo(y) {
    const next = Math.max(0, Math.min(pageMax(), y));
    window.scrollTo(0, next);
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

  figure.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientY);
  });

  figure.addEventListener(
    "touchstart",
    function (e) {
      if (!e.touches[0]) return;
      e.preventDefault();
      startDrag(e.touches[0].clientY);
    },
    { passive: false }
  );

  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    moveToClientY(e.clientY);
  });

  window.addEventListener(
    "touchmove",
    function (e) {
      if (!dragging || !e.touches[0]) return;
      e.preventDefault();
      moveToClientY(e.touches[0].clientY);
    },
    { passive: false }
  );

  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);
  window.addEventListener("touchcancel", stopDrag);

  window.addEventListener("scroll", parkFigure, { passive: true });
  window.addEventListener("resize", parkFigure);
  if (lenis) lenis.on("scroll", parkFigure);
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
})();


