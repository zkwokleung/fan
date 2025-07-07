import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// File name of the 3D model to load
const MODEL_FILE = "scene.gltf";

// Default transform values for the loaded model
const DEFAULT_POSITION = { x: 0, y: -0, z: 0 };
const DEFAULT_ROTATION = { x: 0, y: 1.6, z: 0 }; // radians
const DEFAULT_SCALE = 7; // uniform scalar

// Slider range constants
const SPEED_RANGE = { MIN: 0, MAX: 5, STEP: 0.1 };
const DIRECTION_RANGE = { MIN: 0, MAX: Math.PI * 2, STEP: 0.01 };
const HEIGHT_RANGE = { MIN: -3, MAX: 0.9, STEP: 0.01 };
const ROTX_RANGE = { MIN: -0.5, MAX: 1, STEP: 0.01 };
const SCALE_RANGE = { MIN: 5, MAX: 10, STEP: 0.1 };

function init() {
  const canvas = document.getElementById("three-canvas");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202025);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 4);

  let mixer; // Animation mixer for GLB
  let model; // Reference to loaded fan model

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Load fan model
  const gltfLoader = new GLTFLoader();
  gltfLoader.setPath("/models/");
  // Ensure relative resource paths resolve correctly (textures/bin)
  // gltfLoader.setResourcePath('/models/');
  gltfLoader.load(
    MODEL_FILE,
    (gltf) => {
      const object = gltf.scene;
      model = object;
      console.log(`${MODEL_FILE} loaded`, object);

      // Center and scale model
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const autoScale = 2 / maxDim; // scale so model fits nicely within view
      object.scale.setScalar(autoScale * DEFAULT_SCALE);

      // Center model, then apply default position offset
      box.setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);
      object.position.add(
        new THREE.Vector3(
          DEFAULT_POSITION.x,
          DEFAULT_POSITION.y,
          DEFAULT_POSITION.z
        )
      );

      // Apply default rotation
      object.rotation.set(
        DEFAULT_ROTATION.x,
        DEFAULT_ROTATION.y,
        DEFAULT_ROTATION.z
      );

      scene.add(object);

      // Setup animations
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(object);
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.play();
        });
      }

      // Adjust camera
      camera.position.set(0, 1, 4);
      camera.lookAt(0, 0, 0);

      cube.visible = false; // Hide placeholder

      // Ensure textures color space is correct
      object.traverse((child) => {
        if (child.isMesh && child.material) {
          const { map } = child.material;
          if (map) {
            map.colorSpace = THREE.SRGBColorSpace;
          }
          child.material.needsUpdate = true;
        }
      });

      // -------- Custom HTML Controls --------
      const powerBtn = document.getElementById("powerBtn");
      const speedRange = document.getElementById("speedRange");
      const dirRange = document.getElementById("dirRange");
      const heightRange = document.getElementById("heightRange");
      const scaleRange = document.getElementById("scaleRange");
      const rotXRange = document.getElementById("rotXRange");
      const uiToggleBtn = document.getElementById("uiToggleBtn");
      const controlsPanel = document.getElementById("controls");
      const fullscreenBtn = document.getElementById("fullscreenBtn");
      const resetBtn = document.getElementById("resetBtn");

      if (
        powerBtn &&
        speedRange &&
        dirRange &&
        heightRange &&
        scaleRange &&
        rotXRange &&
        resetBtn
      ) {
        let poweredOn = true;

        // Apply slider ranges and default values
        Object.assign(speedRange, {
          min: SPEED_RANGE.MIN,
          max: SPEED_RANGE.MAX,
          step: SPEED_RANGE.STEP,
          value: 1,
        });

        Object.assign(dirRange, {
          min: DIRECTION_RANGE.MIN,
          max: DIRECTION_RANGE.MAX,
          step: DIRECTION_RANGE.STEP,
          value: object.rotation.y,
        });

        Object.assign(heightRange, {
          min: HEIGHT_RANGE.MIN,
          max: HEIGHT_RANGE.MAX,
          step: HEIGHT_RANGE.STEP,
          value: object.position.y,
        });

        Object.assign(scaleRange, {
          min: SCALE_RANGE.MIN,
          max: SCALE_RANGE.MAX,
          step: SCALE_RANGE.STEP,
          value: DEFAULT_SCALE,
        });

        Object.assign(rotXRange, {
          min: ROTX_RANGE.MIN,
          max: ROTX_RANGE.MAX,
          step: ROTX_RANGE.STEP,
          value: object.rotation.x,
        });

        const updatePowerIcon = () => {
          powerBtn.textContent = poweredOn ? "⏻" : "⏼";
        };
        updatePowerIcon();

        powerBtn.addEventListener("click", () => {
          poweredOn = !poweredOn;
          mixer.timeScale = poweredOn ? parseFloat(speedRange.value) : 0;
          updatePowerIcon();
        });

        speedRange.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          mixer.timeScale = poweredOn ? val : 0;
        });

        dirRange.addEventListener("input", (e) => {
          object.rotation.y = parseFloat(e.target.value);
        });

        heightRange.addEventListener("input", (e) => {
          object.position.y = parseFloat(e.target.value);
        });

        scaleRange.addEventListener("input", (e) => {
          object.scale.setScalar(parseFloat(e.target.value));
        });

        rotXRange.addEventListener("input", (e) => {
          object.rotation.x = parseFloat(e.target.value);
        });

        // ---- Reset to default ----
        resetBtn.addEventListener("click", () => {
          // Defaults
          poweredOn = true;

          // Set sliders values
          speedRange.value = "1";
          dirRange.value = DEFAULT_ROTATION.y;
          heightRange.value = DEFAULT_POSITION.y;
          scaleRange.value = DEFAULT_SCALE;
          rotXRange.value = DEFAULT_ROTATION.x;

          // Apply to model
          object.rotation.set(
            parseFloat(rotXRange.value),
            parseFloat(dirRange.value),
            object.rotation.z
          );
          object.position.y = parseFloat(heightRange.value);
          object.scale.setScalar(parseFloat(scaleRange.value));

          // Animation speed & power icon
          mixer.timeScale = parseFloat(speedRange.value);
          updatePowerIcon();
        });

        // ---- UI toggle ----
        if (uiToggleBtn && controlsPanel) {
          const updateToggleButton = () => {
            const hidden = controlsPanel.style.display === "none";
            uiToggleBtn.textContent = hidden ? "☰" : "✕";
            uiToggleBtn.title = hidden ? "Show Controls" : "Hide Controls";
          };

          uiToggleBtn.addEventListener("click", () => {
            const currentlyHidden = controlsPanel.style.display === "none";
            controlsPanel.style.display = currentlyHidden ? "flex" : "none";
            updateToggleButton();
          });

          updateToggleButton();
        }

        // ---- Drag panel edges to scale UI ----
        if (controlsPanel) {
          const EDGE = 10; // px
          let scaling = false;
          let startScale = 1;
          let anchorX = 0;
          let anchorY = 0;
          let startDist = 0;

          const isNearEdge = (e, rect) => {
            return (
              e.clientX > rect.right - EDGE ||
              e.clientX < rect.left + EDGE ||
              e.clientY > rect.bottom - EDGE ||
              e.clientY < rect.top + EDGE
            );
          };

          const onMouseMove = (e) => {
            if (!scaling) return;
            const dist = Math.hypot(anchorX - e.clientX, anchorY - e.clientY);
            const ratio = dist / startDist;
            const newScale = Math.max(0.5, Math.min(2.5, startScale * ratio));
            controlsPanel.style.transform = `scale(${newScale})`;
          };

          const stopScaling = () => {
            if (!scaling) return;
            scaling = false;
            controlsPanel.classList.remove("resizing");
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", stopScaling);
          };

          controlsPanel.addEventListener("mousemove", (e) => {
            const rect = controlsPanel.getBoundingClientRect();
            controlsPanel.style.cursor = isNearEdge(e, rect)
              ? "nwse-resize"
              : "default";
          });

          controlsPanel.addEventListener("mousedown", (e) => {
            const rect = controlsPanel.getBoundingClientRect();
            if (!isNearEdge(e, rect)) return;

            scaling = true;
            controlsPanel.classList.add("resizing");

            // anchor is bottom-right
            anchorX = rect.right;
            anchorY = rect.bottom;

            const transform = getComputedStyle(controlsPanel).transform;
            if (transform !== "none") {
              const m = new DOMMatrixReadOnly(transform);
              startScale = m.a;
            } else {
              startScale = 1;
            }

            startDist = Math.hypot(anchorX - e.clientX, anchorY - e.clientY);
            if (startDist === 0) startDist = 1;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", stopScaling, { once: true });
          });
        }

        // ---- Fullscreen toggle ----
        if (fullscreenBtn) {
          const updateFsIcon = () => {
            const fs = document.fullscreenElement;
            fullscreenBtn.textContent = fs ? "🡼" : "⛶";
            fullscreenBtn.title = fs ? "Exit Fullscreen" : "Enter Fullscreen";
          };

          fullscreenBtn.addEventListener("click", () => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          });

          document.addEventListener("fullscreenchange", updateFsIcon);
          updateFsIcon();
        }
      }
    },
    (xhr) => {
      console.log(`${MODEL_FILE} ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (err) => {
      console.error("Error loading fan model:", err);
    }
  );

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const clock = new THREE.Clock();

  // Resize handling
  window.addEventListener("resize", () => {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update animations if mixer exists
    if (mixer) {
      mixer.update(delta);
    }

    cube.rotation.x += delta * 0.5;
    cube.rotation.y += delta * 0.7;

    renderer.render(scene, camera);
  }

  animate();
}

init();
