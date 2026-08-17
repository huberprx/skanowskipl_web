(function () {
  const tours = window.SKANOWSKI_TOURS;
  let current = tours[0];
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const loader = document.getElementById("loader");
  if (window.gsap && loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      delay: 0.9,
      ease: "power2.inOut",
      onComplete: function () {
        loader.remove();
      },
    });
  } else if (loader) {
    loader.remove();
  }

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.075 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
  }

  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.body.classList.add("has-cursor");
    window.addEventListener("pointermove", function (event) {
      cursor.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px)";
    });
  }

  const world = window.SkanowskiWorld.init(document.getElementById("world"));
  const stage = document.getElementById("stage");
  const classes = document.getElementById("classes");

  function paint(tour) {
    current = tour;
    document.getElementById("hud-kicker").textContent = tour.kicker;
    document.getElementById("hud-title").textContent = tour.title;
    document.getElementById("hud-place").textContent = tour.place;
    document.getElementById("hud-copy").textContent = tour.copy;
    document.getElementById("hud-maps").href = tour.maps;
    world.load(tour.pano);
    document.querySelectorAll(".class").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-drop") === tour.id);
    });
  }

  tours.forEach(function (tour) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "class";
    btn.setAttribute("data-drop", tour.id);
    btn.innerHTML =
      "<img alt=\"\" src=\"" +
      tour.pano +
      "\" /><span><b>" +
      tour.title +
      "</b><small>" +
      tour.kicker +
      "</small></span>";
    btn.addEventListener("click", function () {
      paint(tour);
    });
    classes.appendChild(btn);
  });

  paint(current);

  const peg = window.SkanowskiPegman.init({
    el: document.getElementById("pegman"),
    onDrop: function (id) {
      const tour = tours.find(function (item) {
        return item.id === id;
      });
      if (tour) paint(tour);
      if (lenis) lenis.scrollTo(window.innerHeight * 1.85);
      else window.scrollTo({ top: window.innerHeight * 1.85, behavior: "smooth" });
    },
  });

  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: "#track",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: function (self) {
        world.setProgress(self.progress);
        const inside = self.progress > 0.72;
        stage.classList.toggle("is-inside", inside);
        const fade = Math.max(0, 1 - self.progress * 1.35);
        document.getElementById("wordmark").style.opacity = fade;
        document.getElementById("lede").style.opacity = fade;
        document.getElementById("run").style.opacity = fade;
        peg.rest(inside);
      },
    });
  } else {
    window.addEventListener("scroll", function () {
      const track = document.getElementById("track");
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (track.offsetHeight - window.innerHeight)));
      world.setProgress(p);
      stage.classList.toggle("is-inside", p > 0.72);
      peg.rest(p > 0.72);
    });
  }
})();
