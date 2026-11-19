/**
 * ==========================================================================
 * Romantic Sorry Babe Website - Core JavaScript
 * Features:
 *  - 3D Glossy Red Heart with Three.js (Volumetric, 360° Rotation, Heartbeat)
 *  - "SORRY BABE ❤️" 3D Wrapped Ribbon rotating with the heart
 *  - Realistic specular shine, dynamic lighting & floor shadow sync
 *  - Falling Rose Petals & Floating Hearts Ambient Canvas
 *  - Interactive Mouse/Touch Heart Sparkle Trail
 *  - Web Audio API Romantic Melody Synthesizer (100% Offline & Reliable)
 *  - Interactive Love Letter Modal & Hug Shower
 *  - Seamless Dual-Engine Fallback (WebGL + CSS 3D)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DHeart();
  initAmbientCanvas();
  initTrailSparkles();
  initAudioPlayer();
  initModalAndInteractions();
});

/* ==========================================================================
   1. THREE.JS 3D GLOSSY RED HEART WITH WRAPPED TEXT
   ========================================================================== */
function init3DHeart() {
  const canvas = document.getElementById('heartCanvas');
  const stage = document.getElementById('heartStage');
  const cssFallback = document.getElementById('cssHeartFallback');
  const floorShadow = document.getElementById('floorShadow');

  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js CDN not detected. Falling back to Pure CSS 3D Volumetric Heart.');
    if (canvas) canvas.style.display = 'none';
    if (cssFallback) cssFallback.style.display = 'block';
    return;
  }

  // Hide CSS fallback if Three.js is ready
  if (cssFallback) cssFallback.style.display = 'none';

  // --- Three.js Setup ---
  const scene = new THREE.Scene();
  
  const width = stage.clientWidth || 480;
  const height = stage.clientHeight || 480;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  camera.position.set(0, 0, 14.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Root Group for Heart, Ribbon & Lights
  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  // --- Create Volumetric 3D Heart Geometry ---
  const heartShape = new THREE.Shape();
  // Mathematical bezier curve for an iconic, perfectly proportioned heart
  const x = 0, y = 0;
  heartShape.moveTo(x, y + 1.2);
  heartShape.bezierCurveTo(x, y + 1.8, x - 0.7, y + 2.5, x - 2.0, y + 2.5);
  heartShape.bezierCurveTo(x - 3.4, y + 2.5, x - 3.5, y + 1.1, x - 3.5, y + 1.1);
  heartShape.bezierCurveTo(x - 3.5, y - 0.6, x - 2.0, y - 2.1, x, y - 3.6);
  heartShape.bezierCurveTo(x + 2.0, y - 2.1, x + 3.5, y - 0.6, x + 3.5, y + 1.1);
  heartShape.bezierCurveTo(x + 3.5, y + 1.1, x + 3.4, y + 2.5, x + 2.0, y + 2.5);
  heartShape.bezierCurveTo(x + 0.7, y + 2.5, x, y + 1.8, x, y + 1.2);

  // Extrude with deep rounded bevel to give genuine 3D plump cushion appearance
  const extrudeSettings = {
    depth: 0.9,
    bevelEnabled: true,
    bevelSegments: 36,
    steps: 4,
    bevelSize: 1.1,
    bevelThickness: 1.1
  };

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  heartGeo.center();
  heartGeo.computeVertexNormals();

  // Glossy Automotive / Candy Apple Ruby Red Physical Material
  const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xee0028,
    emissive: 0x3d000b,
    roughness: 0.12,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.95
  });

  const heartMesh = new THREE.Mesh(heartGeo, heartMaterial);
  heartGroup.add(heartMesh);

  // --- Create Wrapped 3D Ribbon with "SORRY BABE ❤️" ---
  // High-resolution 2048x256 texture for razor-sharp typography
  const textCanvas = document.createElement('canvas');
  textCanvas.width = 2048;
  textCanvas.height = 256;
  const ctx = textCanvas.getContext('2d');

  function drawRibbonTexture() {
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    
    // Luxurious translucent frosted ribbon with rose gold & white sheen
    const grad = ctx.createLinearGradient(0, 0, 0, textCanvas.height);
    grad.addColorStop(0, 'rgba(255, 209, 102, 0.55)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 209, 102, 0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    // Gold accent top and bottom borders with double line
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(textCanvas.width, 8);
    ctx.moveTo(0, textCanvas.height - 8);
    ctx.lineTo(textCanvas.width, textCanvas.height - 8);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(textCanvas.width, 18);
    ctx.moveTo(0, textCanvas.height - 18);
    ctx.lineTo(textCanvas.width, textCanvas.height - 18);
    ctx.stroke();

    // Render "SORRY BABE ❤️" on front (center = 512px) and back (center = 1536px)
    ctx.font = 'bold 88px "Outfit", "Playfair Display", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centers = [512, 1536];
    centers.forEach(cx => {
      // Glow drop shadow
      ctx.shadowColor = 'rgba(230, 0, 40, 0.95)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      // Deep Ruby Red Outline
      ctx.strokeStyle = '#800016';
      ctx.lineWidth = 14;
      ctx.strokeText('SORRY BABE ❤️', cx, textCanvas.height / 2);

      // Bright white fill
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SORRY BABE ❤️', cx, textCanvas.height / 2);

      // Gold Sparkle Stars on the sides
      ctx.shadowColor = 'rgba(255, 209, 102, 0.8)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffd166';
      ctx.font = '48px sans-serif';
      ctx.fillText('✨', cx - 350, textCanvas.height / 2);
      ctx.fillText('✨', cx + 350, textCanvas.height / 2);
    });
  }
  drawRibbonTexture();

  const ribbonTexture = new THREE.CanvasTexture(textCanvas);
  ribbonTexture.wrapS = THREE.RepeatWrapping;
  ribbonTexture.repeat.set(1, 1);

  // Cylinder Geometry wrapped snugly around the heart's waist
  // radius = 1, height = 1.45.
  // Pre-rotate geometry by -PI/2 so u=0.25 is at +Z (Front) and u=0.75 is at -Z (Back)
  const ribbonGeo = new THREE.CylinderGeometry(1, 1, 1.45, 64, 1, true);
  ribbonGeo.rotateY(-Math.PI / 2);

  const ribbonMat = new THREE.MeshStandardMaterial({
    map: ribbonTexture,
    transparent: true,
    side: THREE.DoubleSide,
    roughness: 0.15,
    metalness: 0.35,
    emissive: 0x330512
  });

  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  // Elliptically scale to contour snugly around heart volume
  ribbonMesh.scale.set(4.9, 1.0, 2.05);
  // Gentle romantic tilt across the heart
  ribbonMesh.rotation.z = -0.08;
  ribbonMesh.position.y = -0.25;
  heartGroup.add(ribbonMesh);

  // --- Lighting Setup for Realistic Glossy Reflections ---
  const ambientLight = new THREE.AmbientLight(0xffd6e0, 0.85);
  scene.add(ambientLight);

  // Key Light from Top Left (White Gloss Specular)
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight1.position.set(-6, 8, 10);
  scene.add(dirLight1);

  // Rim / Backlight from Bottom Right (Radiant Rose Glow)
  const dirLight2 = new THREE.DirectionalLight(0xff2b5e, 1.7);
  dirLight2.position.set(6, -6, -8);
  scene.add(dirLight2);

  // Front Specular Highlight Light
  const pointLight = new THREE.PointLight(0xffffff, 1.2, 30);
  pointLight.position.set(0, 3, 12);
  scene.add(pointLight);

  // --- Interactive Drag to Rotate ---
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  let rotationVelocityX = 0;
  let rotationVelocityY = 0.015; // default continuous 360 rotation speed

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    previousMouseX = clientX;
    previousMouseY = clientY;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - previousMouseX;
    const deltaY = clientY - previousMouseY;

    heartGroup.rotation.y += deltaX * 0.012;
    heartGroup.rotation.x += deltaY * 0.008;
    // Clamp vertical tilt to prevent unnatural flipping
    heartGroup.rotation.x = Math.max(-0.4, Math.min(0.4, heartGroup.rotation.x));

    rotationVelocityY = deltaX * 0.005;
    previousMouseX = clientX;
    previousMouseY = clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  stage.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  stage.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // --- Resize Handler ---
  function onWindowResize() {
    const w = stage.clientWidth || 480;
    const h = stage.clientHeight || 480;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onWindowResize);

  // --- Main Animation Loop ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Continuous 360-Degree Rotation around Y-axis
    if (!isDragging) {
      // Smoothly restore base rotation speed
      rotationVelocityY += (0.012 - rotationVelocityY) * 0.03;
      heartGroup.rotation.y += rotationVelocityY;
      // Gently return vertical tilt to neutral
      heartGroup.rotation.x += (0 - heartGroup.rotation.x) * 0.05;
    }

    // 2. Gentle Realistic Heartbeat Animation ("Lub-Dub" Pulse)
    const beatCycle = (elapsedTime * 2.8) % (Math.PI * 2);
    const pulse1 = Math.pow(Math.sin(beatCycle), 12) * 0.08;
    const pulse2 = Math.pow(Math.sin(beatCycle - 0.4), 12) * 0.05;
    const scaleFactor = 1.0 + pulse1 + pulse2;

    heartGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 3. Synchronize Floor Shadow with Heartbeat
    if (floorShadow) {
      const shadowScale = 1.0 + (pulse1 + pulse2) * 1.5;
      const shadowOpacity = 0.65 + (pulse1 + pulse2) * 2.5;
      floorShadow.style.transform = `scale(${shadowScale})`;
      floorShadow.style.opacity = Math.min(shadowOpacity, 0.95);
    }

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   2. AMBIENT BACKGROUND CANVAS: FALLING ROSE PETALS & FLOATING HEARTS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // --- Falling Rose Petals ---
  const petals = [];
  const petalCount = window.innerWidth < 768 ? 24 : 45;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 1.4 + 0.8,
      speedX: Math.random() * 1.2 - 0.6,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      color1: Math.random() > 0.5 ? '#e60026' : '#d90429',
      color2: '#ff758f',
      opacity: Math.random() * 0.45 + 0.4
    });
  }

  // Draw an authentic curved organic rose petal
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(Math.sin(p.sway) * 0.4 + 0.8, 1);
    ctx.globalAlpha = p.opacity;

    const grad = ctx.createRadialGradient(0, -p.size * 0.3, 2, 0, 0, p.size);
    grad.addColorStop(0, p.color2);
    grad.addColorStop(0.6, p.color1);
    grad.addColorStop(1, '#800016');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.7, p.size * 0.8, p.size * 0.6, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.9, -p.size * 0.7, 0, -p.size);
    ctx.fill();

    ctx.restore();
  }

  // --- Floating Hearts Drifting Upwards ---
  const hearts = [];
  const heartCount = window.innerWidth < 768 ? 16 : 28;

  for (let i = 0; i < heartCount; i++) {
    hearts.push({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: Math.random() * 12 + 8,
      speedY: Math.random() * 0.8 + 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.5 + 0.25,
      color: Math.random() > 0.5 ? '#ff4d6d' : '#ff85a1'
    });
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.globalAlpha = h.opacity;
    ctx.fillStyle = h.color;

    const s = h.size / 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5 * s, -12 * s, -15 * s, -12 * s, -15 * s, 0);
    ctx.bezierCurveTo(-15 * s, 8 * s, 0, 15 * s, 0, 18 * s);
    ctx.bezierCurveTo(0, 15 * s, 15 * s, 8 * s, 15 * s, 0);
    ctx.bezierCurveTo(15 * s, -12 * s, 5 * s, -12 * s, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  // Background Animation Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw falling petals
    for (let p of petals) {
      p.y += p.speedY;
      p.x += Math.sin(p.sway) * 0.8 + p.speedX;
      p.sway += p.swaySpeed;
      p.angle += p.rotationSpeed;

      if (p.y > height + 30) {
        p.y = -30;
        p.x = Math.random() * width;
      }
      drawPetal(p);
    }

    // Update & draw floating hearts
    for (let h of hearts) {
      h.y -= h.speedY;
      h.x += Math.sin(h.sway) * 0.6;
      h.sway += h.swaySpeed;

      if (h.y < -30) {
        h.y = height + 30;
        h.x = Math.random() * width;
      }
      drawHeart(h);
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. INTERACTIVE MOUSE / TOUCH SPARKLE & HEART TRAIL
   ========================================================================== */
function initTrailSparkles() {
  const canvas = document.getElementById('trailCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];

  function spawnTrail(x, y) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.8 - 0.5,
        size: Math.random() * 8 + 5,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        isHeart: Math.random() > 0.4
      });
    }
  }

  window.addEventListener('mousemove', e => spawnTrail(e.clientX, e.clientY));
  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      spawnTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function animateTrail() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);

      if (p.isHeart) {
        ctx.fillStyle = '#ff4d6d';
        const s = p.size / 14;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-4 * s, -8 * s, -12 * s, -8 * s, -12 * s, 0);
        ctx.bezierCurveTo(-12 * s, 6 * s, 0, 10 * s, 0, 13 * s);
        ctx.bezierCurveTo(0, 10 * s, 12 * s, 6 * s, 12 * s, 0);
        ctx.bezierCurveTo(12 * s, -8 * s, 4 * s, -8 * s, 0, 0);
        ctx.fill();
      } else {
        // Golden twinkle star
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

/* ==========================================================================
   4. ROMANTIC MUSIC BOX SYNTHESIZER (Web Audio API - 100% Offline & Reliable)
   ========================================================================== */
function initAudioPlayer() {
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicText = document.getElementById('musicText');
  const musicIcon = document.getElementById('musicIcon');
  if (!musicBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let timeoutId = null;

  // Gentle, romantic music box arpeggios (C maj7 - Am9 - F maj7 - G sus4)
  const melodyNotes = [
    261.63, 329.63, 392.00, 493.88, // C, E, G, B
    220.00, 261.63, 329.63, 440.00, // A, C, E, A
    174.61, 220.00, 261.63, 349.23, // F, A, C, F
    196.00, 246.94, 293.66, 392.00  // G, B, D, G
  ];

  let noteIndex = 0;

  function playTone(freq) {
    if (!audioCtx || !isPlaying) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Soft music-box bell tone (sine + soft decay)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  function stepMelody() {
    if (!isPlaying) return;
    const note = melodyNotes[noteIndex % melodyNotes.length];
    playTone(note);
    noteIndex++;
    timeoutId = setTimeout(stepMelody, 420);
  }

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      musicBtn.classList.add('playing');
      musicText.textContent = 'Playing Our Melody';
      musicIcon.textContent = '💖';
      stepMelody();
    } else {
      musicBtn.classList.remove('playing');
      musicText.textContent = 'Play Our Melody';
      musicIcon.textContent = '🎵';
      clearTimeout(timeoutId);
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE MODALS & BUTTON ACTIONS
   ========================================================================== */
function initModalAndInteractions() {
  const openHeartBtn = document.getElementById('openHeartBtn');
  const giveHugBtn = document.getElementById('giveHugBtn');
  const loveLetterModal = document.getElementById('loveLetterModal');
  const letterCloseBtn = document.getElementById('letterCloseBtn');
  const letterForgiveBtn = document.getElementById('letterForgiveBtn');
  const hugOverlay = document.getElementById('hugOverlay');
  const hugDoneBtn = document.getElementById('hugDoneBtn');

  // --- Celebration Confetti Fallback ---
  function launchHeartConfetti(count = 70) {
    if (typeof confetti === 'function') {
      // If canvas-confetti library loaded
      confetti({
        particleCount: count,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff0037', '#ff4d6d', '#ffd166', '#ffffff', '#ff85a1']
      });
    } else {
      // Standalone internal confetti generator
      triggerCustomHeartShower();
    }
  }

  // Standalone Custom Heart Shower Generator
  function triggerCustomHeartShower() {
    const showerContainer = document.createElement('div');
    showerContainer.style.position = 'fixed';
    showerContainer.style.top = '0';
    showerContainer.style.left = '0';
    showerContainer.style.width = '100vw';
    showerContainer.style.height = '100vh';
    showerContainer.style.pointerEvents = 'none';
    showerContainer.style.zIndex = '9999';
    document.body.appendChild(showerContainer);

    const heartsSymbols = ['❤️', '💖', '💕', '🌹', '✨', '💝', '🥰'];

    for (let i = 0; i < 60; i++) {
      const span = document.createElement('span');
      span.textContent = heartsSymbols[Math.floor(Math.random() * heartsSymbols.length)];
      span.style.position = 'absolute';
      span.style.left = Math.random() * 100 + 'vw';
      span.style.top = '-50px';
      span.style.fontSize = Math.random() * 24 + 18 + 'px';
      span.style.opacity = '1';
      span.style.transition = `all ${Math.random() * 2 + 2}s cubic-bezier(0.25, 0.8, 0.25, 1)`;

      showerContainer.appendChild(span);

      setTimeout(() => {
        span.style.transform = `translate(${(Math.random() - 0.5) * 200}px, 110vh) rotate(${Math.random() * 360}deg)`;
        span.style.opacity = '0';
      }, 50);
    }

    setTimeout(() => {
      showerContainer.remove();
    }, 4500);
  }

  // --- Button 1: "Open My Heart ❤️" ---
  if (openHeartBtn && loveLetterModal) {
    openHeartBtn.addEventListener('click', () => {
      loveLetterModal.classList.add('active');
      launchHeartConfetti(50);
    });
  }

  if (letterCloseBtn && loveLetterModal) {
    letterCloseBtn.addEventListener('click', () => {
      loveLetterModal.classList.remove('active');
    });
  }

  if (letterForgiveBtn && loveLetterModal) {
    letterForgiveBtn.addEventListener('click', () => {
      loveLetterModal.classList.remove('active');
      launchHeartConfetti(120);
      alert('Thank you for forgiving me, my love! ❤️ You made my heart so happy!');
    });
  }

  // Close letter on clicking backdrop outside parchment
  if (loveLetterModal) {
    loveLetterModal.addEventListener('click', e => {
      if (e.target === loveLetterModal) {
        loveLetterModal.classList.remove('active');
      }
    });
  }

  // --- Button 2: "One More Hug? 🤗" ---
  if (giveHugBtn && hugOverlay) {
    giveHugBtn.addEventListener('click', () => {
      hugOverlay.classList.add('active');
      triggerCustomHeartShower();
      launchHeartConfetti(80);
    });
  }

  if (hugDoneBtn && hugOverlay) {
    hugDoneBtn.addEventListener('click', () => {
      hugOverlay.classList.remove('active');
      launchHeartConfetti(60);
    });
  }

  if (hugOverlay) {
    hugOverlay.addEventListener('click', e => {
      if (e.target === hugOverlay) {
        hugOverlay.classList.remove('active');
      }
    });
  }
}
