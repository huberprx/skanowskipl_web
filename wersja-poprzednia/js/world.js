window.SkanowskiWorld = (function () {
  function init(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 2000);

    const loader = new THREE.TextureLoader();
    const geo = new THREE.SphereGeometry(1, 80, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const globe = new THREE.Mesh(geo, mat);
    scene.add(globe);

    const dustGeo = new THREE.BufferGeometry();
    const n = 500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xffc107,
        size: 0.03,
        transparent: true,
        opacity: 0.45,
      })
    );
    scene.add(dust);

    const state = {
      progress: 0,
      lon: 180,
      lat: 6,
      dragging: false,
      lastX: 0,
      lastY: 0,
      pointer: { x: 0, y: 0 },
    };

    function load(url) {
      loader.load(url, function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        mat.map = texture;
        mat.color.set(0xffffff);
        mat.needsUpdate = true;
      });
    }

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }

    function setProgress(p) {
      state.progress = Math.max(0, Math.min(1, p));
    }

    function apply() {
      const p = state.progress;
      const inside = p > 0.72;
      if (inside) {
        globe.scale.set(-500, 500, 500);
      } else {
        globe.scale.setScalar(1.55 + p * 1.8);
      }
      mat.side = THREE.FrontSide;

      if (inside) {
        camera.fov = 72;
        camera.position.set(0, 0, 0.01);
        const phi = THREE.MathUtils.degToRad(90 - state.lat);
        const theta = THREE.MathUtils.degToRad(state.lon);
        camera.lookAt(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        );
      } else {
        camera.fov = 48;
        const dist = 4.4 - p * 2.1;
        camera.position.set(state.pointer.x * 0.55, 0.15 + state.pointer.y * 0.2, dist);
        camera.lookAt(0, 0, 0);
        globe.rotation.y += 0.0024;
      }
      camera.updateProjectionMatrix();
      dust.visible = !inside;
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (state.progress < 0.7) return;
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    });
    window.addEventListener("pointermove", function (event) {
      state.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!state.dragging) return;
      state.lon -= (event.clientX - state.lastX) * 0.18;
      state.lat = Math.max(-85, Math.min(85, state.lat + (event.clientY - state.lastY) * 0.16));
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    });
    window.addEventListener("pointerup", function () {
      state.dragging = false;
    });
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    function tick() {
      if (state.progress > 0.72 && !state.dragging) state.lon += 0.03;
      apply();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return {
      load: load,
      setProgress: setProgress,
      resize: resize,
      isInside: function () {
        return state.progress > 0.72;
      },
    };
  }

  return { init: init };
})();
