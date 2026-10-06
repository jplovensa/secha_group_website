import { MOODBOARDS, MATERIAL_PALETTES } from "./data.js";
let THREE;
try {
  THREE = await import("./vendor/three.module.js");
} catch {
  /* UI remains usable without the renderer. */
}
export function initScenes() {
  let setMoodboardCameraTarget = null,
    updateVignetteMaterial = null;
  const activeMaterial = MATERIAL_PALETTES.architect[0];
  function initMoodboardStudio() {
    const container = document.getElementById("moodboard-canvas");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const spotLight = new THREE.SpotLight(0xffffff, 5);
    spotLight.position.set(0, 15, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    const rectLight = new THREE.RectAreaLight(0xffffff, 2, 10, 10);
    rectLight.position.set(0, 5, -5);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // Grid
    const gridHelper = new THREE.GridHelper(100, 100, 0x333333, 0x111111);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Objects
    const objects = [];
    const spacing = 12;

    MOODBOARDS.forEach((board, i) => {
      let geometry;
      switch (board.geo) {
        case "box":
          geometry = new THREE.BoxGeometry(3, 3, 3);
          break;
        case "sphere":
          geometry = new THREE.SphereGeometry(2, 64, 64);
          break;
        case "octahedron":
          geometry = new THREE.OctahedronGeometry(2.5, 0);
          break;
        case "cylinder":
          geometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
          break;
        case "torus":
          geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
          break;
        case "icosahedron":
          geometry = new THREE.IcosahedronGeometry(2.2, 0);
          break;
      }

      const material = new THREE.MeshStandardMaterial({
        color: board.color,
        roughness: board.roughness,
        metalness: board.metalness,
        transparent: board.transparent || false,
        opacity: board.opacity || 1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * spacing;

      // Wireframe Tech Overlay
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.2,
        }),
      );
      mesh.add(line);

      scene.add(mesh);
      objects.push(mesh);
    });

    // Animation Loop variables
    let targetCameraX = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Expose target setter
    setMoodboardCameraTarget = (idx) => {
      targetCameraX = idx * spacing;
    };

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const rect = container.getBoundingClientRect();
      if (document.hidden || rect.bottom < 0 || rect.top > innerHeight) return;
      const time = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : clock.getElapsedTime();

      // Camera interpolation
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetCameraX + mouseX * 2,
        0.05,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        2 + mouseY * 2,
        0.05,
      );

      spotLight.position.x = camera.position.x;
      spotLight.target.position.x = targetCameraX;
      spotLight.target.updateMatrixWorld();

      // Object subtle animations
      objects.forEach((obj, idx) => {
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
          obj.rotation.y += 0.005;
        obj.rotation.x = Math.sin(time * 0.5 + idx) * 0.2;
        obj.position.y = Math.sin(time + idx) * 0.5;
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // --- THREE.JS SCENE 2: FINISHING STUDIO (VIGNETTE) ---
  function initFinishingStudio() {
    const container = document.getElementById("vignette-canvas");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const mainLight = new THREE.SpotLight(0xffffff, 4);
    mainLight.position.set(5, 10, 5);
    mainLight.angle = Math.PI / 4;
    mainLight.penumbra = 0.5;
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffffff, 2);
    fillLight.position.set(-5, 2, -5);
    scene.add(fillLight);

    // Architecture Group
    const vignetteGroup = new THREE.Group();

    // PERFORMANCE OPTIMIZATION: SHARED MATERIAL
    // This single material instance is used by multiple meshes in the scene.
    // We update its properties dynamically rather than recreating materials.
    const sharedMaterial = new THREE.MeshStandardMaterial({
      color: activeMaterial.color,
      roughness: activeMaterial.roughness,
      metalness: activeMaterial.metalness,
      transparent: activeMaterial.transparent || false,
      opacity: activeMaterial.opacity || 1.0,
    });

    // Expose update function
    updateVignetteMaterial = (matDef) => {
      sharedMaterial.color.setHex(matDef.color);
      sharedMaterial.roughness = matDef.roughness;
      sharedMaterial.metalness = matDef.metalness;
      sharedMaterial.transparent = matDef.transparent || false;
      sharedMaterial.opacity = matDef.opacity || 1.0;
      sharedMaterial.needsUpdate = true;
    };

    // Floor & Base Walls
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.1,
        metalness: 0.5,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    vignetteGroup.add(floor);

    const baseWallMat = new THREE.MeshStandardMaterial({
      color: 0x151515,
      roughness: 0.9,
    });
    const baseWall = new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 1),
      baseWallMat,
    );
    baseWall.position.set(0, 4, -5);
    baseWall.receiveShadow = true;
    vignetteGroup.add(baseWall);

    // Dynamic Panels (uses sharedMaterial)
    for (let i = 0; i < 8; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 10, 0.4),
        sharedMaterial,
      );
      panel.position.set(-4.5 + i * 1.5, 4, -4.3);
      panel.castShadow = true;
      panel.receiveShadow = true;
      vignetteGroup.add(panel);
    }

    // Concrete Podium
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.4, 64),
      new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.8,
        metalness: 0.2,
      }),
    );
    pedestal.position.set(0, -0.8, 0);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    vignetteGroup.add(pedestal);

    // Lounge Chair
    const chairGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.2,
      metalness: 0.8,
    });

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.2, 2.2),
      frameMat,
    );
    frame.position.y = 0.5;
    frame.castShadow = true;
    chairGroup.add(frame);

    // Seat & Back (uses sharedMaterial)
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.6, 2),
      sharedMaterial,
    );
    seat.position.y = 0.9;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.8, 0.5),
      sharedMaterial,
    );
    back.position.set(0, 1.9, -0.8);
    back.rotation.x = -0.15;
    back.castShadow = true;
    back.receiveShadow = true;
    chairGroup.add(back);

    const armGeo = new THREE.BoxGeometry(0.4, 1.2, 2.2);
    const armL = new THREE.Mesh(armGeo, sharedMaterial);
    armL.position.set(-1.1, 1.5, 0);
    armL.castShadow = true;
    chairGroup.add(armL);
    const armR = new THREE.Mesh(armGeo, sharedMaterial);
    armR.position.set(1.1, 1.5, 0);
    armR.castShadow = true;
    chairGroup.add(armR);

    [
      [-1, 0.2, -1],
      [1, 0.2, -1],
      [-1, 0.2, 1],
      [1, 0.2, 1],
    ].forEach((pos) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16),
        frameMat,
      );
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      chairGroup.add(leg);
    });

    chairGroup.position.set(-0.5, -0.6, 1);
    chairGroup.rotation.y = Math.PI / 6;
    vignetteGroup.add(chairGroup);

    // Side Table
    const tableGroup = new THREE.Group();
    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.6, 1.2, 32),
      baseWallMat,
    );
    tableBase.position.y = 0.6;
    tableBase.castShadow = true;
    tableGroup.add(tableBase);

    // Table Top (uses sharedMaterial)
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32),
      sharedMaterial,
    );
    tableTop.position.y = 1.25;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    tableGroup.position.set(2, -0.6, 0.5);
    vignetteGroup.add(tableGroup);

    scene.add(vignetteGroup);

    // Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      const rect = container.getBoundingClientRect();
      if (document.hidden || rect.bottom < 0 || rect.top > innerHeight) return;
      vignetteGroup.rotation.y = THREE.MathUtils.lerp(
        vignetteGroup.rotation.y,
        mouseX * 0.15,
        0.05,
      );
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        mouseX * 1.5,
        0.05,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        3 + mouseY * 1,
        0.05,
      );
      camera.lookAt(0, 1.5, 0);
      renderer.render(scene, camera);
    }
    animate();

    // Resize Observer for robustness
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    ro.observe(container);
  }

  for (const [init, id] of [
    [initMoodboardStudio, "moodboard-canvas"],
    [initFinishingStudio, "vignette-canvas"],
  ]) {
    try {
      init();
    } catch {
      const container = document.getElementById(id);
      container.replaceChildren();
      container.classList.add("scene-fallback");
      container.textContent =
        "3D preview unavailable on this device. You can still explore every material and build your design brief.";
    }
  }
  return {
    camera(index) {
      setMoodboardCameraTarget?.(index);
    },
    material(value) {
      updateVignetteMaterial?.(value);
    },
  };
}
