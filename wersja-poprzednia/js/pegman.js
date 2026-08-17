window.SkanowskiPegman = (function () {
  function init(options) {
    const el = options.el;
    const onDrop = options.onDrop;
    if (!el) return;

    const state = { held: false, ox: 0, oy: 0 };

    function place(x, y) {
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.right = "auto";
    }

    function rest(inside) {
      if (state.held) return;
      if (inside) {
        place(window.innerWidth - 108, window.innerHeight * 0.42);
        el.classList.remove("is-walking");
        return;
      }
      const y = window.scrollY || 0;
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const t = Math.min(1, y / max);
      place(window.innerWidth * 0.5 + 70, window.innerHeight * 0.34 + t * 40);
      el.classList.toggle("is-walking", y > 30 && y < max * 0.55);
    }

    function hit(x, y) {
      let found = null;
      document.querySelectorAll("[data-drop]").forEach(function (node) {
        const r = node.getBoundingClientRect();
        const on =
          x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        node.classList.toggle("is-target", on);
        if (on) found = node.getAttribute("data-drop");
      });
      return found;
    }

    el.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      state.held = true;
      el.classList.add("is-held");
      el.classList.remove("is-walking", "is-hint");
      const r = el.getBoundingClientRect();
      state.ox = event.clientX - r.left;
      state.oy = event.clientY - r.top;
      el.setPointerCapture(event.pointerId);
    });

    window.addEventListener("pointermove", function (event) {
      if (!state.held) return;
      place(event.clientX - state.ox, event.clientY - state.oy);
      hit(event.clientX, event.clientY);
    });

    window.addEventListener("pointerup", function (event) {
      if (!state.held) return;
      state.held = false;
      el.classList.remove("is-held");
      const id = hit(event.clientX, event.clientY);
      document.querySelectorAll("[data-drop]").forEach(function (node) {
        node.classList.remove("is-target");
      });
      if (id && onDrop) onDrop(id);
    });

    window.setTimeout(function () {
      el.classList.add("is-hint");
      window.setTimeout(function () {
        el.classList.remove("is-hint");
      }, 3800);
    }, 1400);

    return { rest: rest };
  }

  return { init: init };
})();
