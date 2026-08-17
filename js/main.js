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

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const lenis = new Lenis({ lerp: 0.07 });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
  }

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
      document.getElementById("survey").scrollIntoView({ behavior: "smooth" });
    }
    const btn = plate.querySelector("button");
    if (btn) btn.addEventListener("click", go);
    if (!plate.querySelector("iframe")) {
      plate.querySelector(".plate__img").addEventListener("click", go);
    }
  });

  const figure = document.getElementById("figure");
  function parkFigure() {
    const y = window.scrollY || 0;
    const max = Math.max(document.body.scrollHeight - innerHeight, 1);
    const t = Math.min(1, y / max);
    figure.style.top = 120 + t * (innerHeight - 240) + "px";
    figure.classList.toggle("is-walk", y > 40 && t < 0.92);
  }
  window.addEventListener("scroll", parkFigure, { passive: true });
  parkFigure();
  figure.addEventListener("click", function () {
    document.getElementById("survey").scrollIntoView({ behavior: "smooth" });
  });

  if (cursor) {
    window.addEventListener("pointermove", function (e) {
      const boxes = document.querySelectorAll(
        ".instrument__frame, .plate__img--walk, .booking__frame"
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


