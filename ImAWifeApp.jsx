import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Heart,
  Flower2,
  Sparkles,
  Gem,
  Gift,
  Cookie,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  RefreshCcw,
  Link as LinkIcon,
  Share2,
  Camera,
  Users,
  MessageCircle,
} from "lucide-react";

const GIFT_OPTIONS = [
  { id: "flowers", label: "Flowers", icon: Flower2, link: "https://example.com/REPLACE-WITH-FLOWER-LINK" },
  { id: "dessert", label: "My Favourite Dessert", icon: Cookie, link: "https://example.com/REPLACE-WITH-DESSERT-LINK" },
  { id: "spa", label: "Spa Day", icon: Sparkles, link: "https://example.com/REPLACE-WITH-SPA-LINK" },
  { id: "jewelry", label: "Something Sparkly", icon: Gem, link: "https://example.com/REPLACE-WITH-JEWELRY-LINK" },
  { id: "date", label: "Date Night", icon: Heart, link: "https://example.com/REPLACE-WITH-DATE-NIGHT-LINK" },
  { id: "surprise", label: "His Choice — Surprise Me", icon: Gift, link: "https://example.com/REPLACE-WITH-SURPRISE-LINK" },
];

const SITUATIONS = [
  { id: "gift", label: "I just want a gift", phrase: "I just want you to get me a gift — that's it, that's the tweet" },
  { id: "forgot", label: "He forgot something important", phrase: "you forgot something that mattered to me" },
  { id: "phone", label: "He was distracted / on his phone", phrase: "I felt like I was talking to your phone instead of you" },
  { id: "words", label: "Something he said stung", phrase: "something you said earlier really stuck with me" },
  { id: "help", label: "He didn't help enough", phrase: "I felt like I was carrying more than my share today" },
  { id: "dismissed", label: "He brushed off how I felt", phrase: "I felt brushed off when I tried to tell you how I felt" },
  { id: "plans", label: "He changed plans without asking", phrase: "I was looking forward to our plans and felt sidelined when they changed" },
  { id: "attention", label: "I felt invisible or unheard", phrase: "I felt invisible in that moment, like my presence didn't matter" },
  { id: "comparison", label: "He compared me to someone else", phrase: "when you compared me to someone else, it made me feel inadequate" },
  { id: "priority", label: "I wasn't a priority today", phrase: "today I felt like I wasn't a priority, and that hurt" },
  { id: "tone", label: "His tone was harsh or dismissive", phrase: "the tone you used made me feel small" },
  { id: "promise", label: "He broke a promise", phrase: "I was counting on you keeping that promise" },
  { id: "other", label: "Something else", phrase: null },
];

const AFFIRMATIONS = [
  "Your feelings are real, even if no one else noticed them today.",
  "You can love him and still feel hurt by him in the same breath.",
  "Needing a minute before you respond isn't weakness — it's wisdom.",
  "You don't have to perform “fine.” You're allowed to just be tired.",
  "Naming what hurt you isn't the same as starting a fight.",
  "You deserve care that doesn't require you to ask twice.",
  "It's okay to ask for what you need, even if it feels uncomfortable.",
  "Your boundaries are valid, even when they inconvenience others.",
  "Taking space to process your emotions is a sign of strength, not distance.",
  "You are allowed to change your mind and express new feelings.",
  "Your worth isn't measured by how much you tolerate.",
  "It's brave to be vulnerable, even when you're not sure how it will be received.",
  "You can be understanding without abandoning your own needs.",
  "Your intuition matters — trust what you're feeling.",
  "Healing happens in small moments of honesty, not just grand gestures.",
  "You are more than your role as a wife — you're a whole person with valid needs.",
  "It's okay to feel multiple emotions at once — love and frustration can coexist.",
  "Your voice matters, even when it shakes.",
  "Setting boundaries is an act of love for both of you.",
  "You don't have to have it all figured out right now.",
  "Your emotional labor is valuable and deserves recognition.",
  "It's okay to need reassurance — we all do sometimes.",
  "Your peace is worth protecting, even if it means saying no.",
  "You're doing the best you can with what you have today.",
  "Growth happens in the messy middle, not just at the destination.",
];

const BREATH_PHASES = [
  { name: "Breathe in", ms: 4000, scale: 1.3 },
  { name: "Hold", ms: 3000, scale: 1.3 },
  { name: "Breathe out", ms: 5000, scale: 1 },
];

const STEP_LABELS = ["What happened", "Breathe", "Affirmations", "A little something", "Tell him"];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..500&family=Work+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .iaw-root {
    min-height: 100vh;
    width: 100%;
    font-family: 'Work Sans', system-ui, sans-serif;
    color: #3D2630;
    background: linear-gradient(160deg, #FEF5EF 0%, #F8E8DC 55%, #F1D9C8 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 48px;
  }

  .iaw-serif { font-family: 'Fraunces', Georgia, serif; }

  /* ── Wrapper ── */
  .iaw-wrap {
    width: 100%;
    max-width: 580px;
    padding: 0 18px;
  }

  /* ── Header ── */
  .iaw-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 0 20px;
    gap: 14px;
  }
  .iaw-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .iaw-brand-label {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7A5560;
    font-weight: 500;
  }
  .iaw-steps {
    display: flex;
    gap: 7px;
    align-items: center;
  }
  .iaw-step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #C96B5E30;
    transition: all 0.3s ease;
  }
  .iaw-step-dot.active {
    background: #C96B5E;
    width: 20px;
    border-radius: 3px;
  }

  /* ── Card ── */
  .iaw-card {
    background: #FFFCF9;
    border-radius: 24px;
    box-shadow:
      0 2px 8px rgba(61, 38, 48, 0.06),
      0 8px 32px rgba(61, 38, 48, 0.09);
    width: 100%;
    padding: 32px 28px;
  }

  /* ── Fade in ── */
  .iaw-fade {
    animation: iawFade 0.35s ease both;
  }
  @keyframes iawFade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Typography ── */
  .iaw-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.9rem, 7vw, 2.7rem);
    font-weight: 400;
    line-height: 1.2;
    color: #3D2630;
    margin-bottom: 14px;
  }
  .iaw-heading {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.4rem, 5vw, 1.85rem);
    font-weight: 400;
    line-height: 1.3;
    color: #3D2630;
    margin-bottom: 8px;
  }
  .iaw-sub {
    font-size: 14px;
    line-height: 1.65;
    color: #7A5560;
    margin-bottom: 24px;
  }
  .iaw-field-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #9B7080;
    margin-bottom: 7px;
  }

  /* ── Situation chips ── */
  .iaw-chip-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }
  .iaw-chip {
    width: 100%;
    border: 1.5px solid #E0B8B033;
    background: #FFFCF9;
    border-radius: 14px;
    padding: 14px 18px;
    text-align: left;
    font-size: 14px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    color: #3D2630;
    cursor: pointer;
    transition: border-color 0.16s, background 0.16s, color 0.16s;
    -webkit-tap-highlight-color: transparent;
  }
  .iaw-chip:hover { border-color: #C96B5E66; background: #FFF8F5; }
  .iaw-chip.selected { background: #C96B5E; border-color: #C96B5E; color: #fff; }

  /* ── Gift grid ── */
  .iaw-gift-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 28px;
  }
  .iaw-gift-chip {
    border: 1.5px solid #E0B8B033;
    background: #FFFCF9;
    border-radius: 18px;
    padding: 22px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    color: #3D2630;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.16s, background 0.16s, color 0.16s;
    -webkit-tap-highlight-color: transparent;
  }
  .iaw-gift-chip:hover { border-color: #C96B5E66; background: #FFF8F5; }
  .iaw-gift-chip.selected { background: #C96B5E; border-color: #C96B5E; color: #fff; }

  /* ── Buttons ── */
  .iaw-btn {
    border: none;
    border-radius: 50px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 48px;
    padding: 12px 26px;
    font-size: 14px;
    transition: background 0.18s, transform 0.14s, opacity 0.18s;
    -webkit-tap-highlight-color: transparent;
  }
  .iaw-btn:disabled { opacity: 0.38; cursor: not-allowed; transform: none !important; }

  .iaw-btn-primary {
    background: #C96B5E;
    color: #fff;
  }
  .iaw-btn-primary:hover:not(:disabled) { background: #B55E52; transform: translateY(-1px); }

  .iaw-btn-ghost {
    background: transparent;
    color: #7A5560;
    border: 1.5px solid #7A556030;
  }
  .iaw-btn-ghost:hover:not(:disabled) { background: rgba(122, 85, 96, 0.06); border-color: #7A556088; }

  .iaw-btn-blue {
    background: #5A7BA6;
    color: #fff;
  }
  .iaw-btn-blue:hover:not(:disabled) { background: #4D6E97; transform: translateY(-1px); }

  .iaw-btn-sm {
    min-height: 38px;
    padding: 8px 18px;
    font-size: 13px;
  }

  /* ── Nav row ── */
  .iaw-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
    gap: 12px;
  }

  /* ── Form inputs ── */
  .iaw-input, .iaw-textarea {
    width: 100%;
    font-family: 'Work Sans', sans-serif;
    font-size: 16px;
    border: 1.5px solid #E0B8B044;
    border-radius: 13px;
    padding: 13px 16px;
    background: #FFFEFB;
    color: #3D2630;
    transition: border-color 0.18s;
    -webkit-appearance: none;
    appearance: none;
  }
  .iaw-input:focus, .iaw-textarea:focus {
    outline: none;
    border-color: #C96B5E;
  }
  .iaw-textarea {
    resize: vertical;
    min-height: 160px;
    line-height: 1.65;
  }

  /* ── Section panels ── */
  .iaw-panel {
    background: #FFF8F5;
    border: 1px solid #E0B8B022;
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 14px;
  }


  /* ── Affirmation ── */
  .iaw-affirmation-box {
    background: linear-gradient(135deg, #F8E2D4, #EEC9B8);
    border-radius: 20px;
    padding: 32px 26px;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 14px;
  }
  .iaw-affirmation-text {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.05rem, 4vw, 1.25rem);
    font-weight: 400;
    line-height: 1.55;
    color: #3D2630;
  }
  .iaw-aff-counter {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #9B708088;
    text-align: center;
    margin-bottom: 18px;
  }
  .iaw-progress-bar {
    height: 2px;
    background: #E0B8B030;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 6px;
  }
  .iaw-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #E2978C, #C96B5E);
    border-radius: 2px;
    transform-origin: left;
    animation: iawSweep 2s linear infinite;
  }
  @keyframes iawSweep {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  .iaw-aff-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }

  /* ── Send step ── */
  .iaw-send-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  .iaw-send-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── Social share ── */
  .iaw-share-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin-bottom: 14px;
  }
  .iaw-share-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 14px 10px;
    background: #FFFCF9;
    border: 1.5px solid #E0B8B033;
    border-radius: 16px;
    cursor: pointer;
    font-size: 12px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    color: #3D2630;
    transition: border-color 0.16s, background 0.16s;
    -webkit-tap-highlight-color: transparent;
  }
  .iaw-share-btn:hover { border-color: #C96B5E55; background: #FFF8F5; }
  .iaw-share-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
  }
  .iaw-share-link-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* ── Status banners ── */
  .iaw-status-ok {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #F0F9F0;
    border: 1px solid #B8DEB8;
    border-radius: 13px;
    font-size: 13px;
    color: #2A6630;
    margin-bottom: 14px;
  }
  .iaw-status-err {
    padding: 12px 16px;
    background: #FEF0F0;
    border: 1px solid #F5BABA;
    border-radius: 13px;
    font-size: 13px;
    color: #C03030;
    margin-bottom: 14px;
  }

  /* ── Footer ── */
  .iaw-footer {
    font-size: 11px;
    color: #9B708070;
    text-align: center;
    padding: 0 24px 8px;
    max-width: 380px;
    line-height: 1.65;
    margin-top: 8px;
  }

  /* ── Inline flex helpers ── */
  .iaw-row { display: flex; align-items: center; gap: 8px; }
  .iaw-row-between { display: flex; align-items: center; justify-content: space-between; }

  /* ── Spinner ── */
  @keyframes iawSpin { to { transform: rotate(360deg); } }
  .iaw-spin { animation: iawSpin 0.9s linear infinite; }

  /* ── Two-col email grid ── */
  .iaw-email-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  @media (max-width: 380px) {
    .iaw-card { padding: 24px 18px; }
    .iaw-email-grid { grid-template-columns: 1fr; }
    .iaw-send-row { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   Three.js breathing orb
   ───────────────────────────────────────────────────────────── */
function BreathingOrb({ phaseIdx, phases }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ phaseIdx, phases });

  useEffect(() => {
    stateRef.current = { phaseIdx, phases };
  }, [phaseIdx, phases]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const SIZE = el.clientWidth;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene / camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 3.2;

    // ── Main orb ──────────────────────────────────────────────
    const geo = new THREE.SphereGeometry(1, 56, 56);
    const origPos = new Float32Array(geo.attributes.position.array);

    const mat = new THREE.MeshPhongMaterial({
      color:            new THREE.Color("#D0735F"),
      emissive:         new THREE.Color("#C96B5E"),
      emissiveIntensity: 0.18,
      shininess:        90,
      transparent:      true,
      opacity:          0.93,
    });
    const orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    // ── Halo layers ───────────────────────────────────────────
    const makeHalo = (radius, color, opacity) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity, side: THREE.BackSide })
      );
      scene.add(m);
      return m;
    };
    const halo1 = makeHalo(1.14, "#E2978C", 0.10);
    const halo2 = makeHalo(1.30, "#F6DACE", 0.05);
    const halo3 = makeHalo(1.50, "#FEF5EF", 0.03);

    // ── Particles ─────────────────────────────────────────────
    const ptCount = 80;
    const ptGeo   = new THREE.BufferGeometry();
    const ptPos   = new Float32Array(ptCount * 3);
    const ptSpeeds = [];
    for (let i = 0; i < ptCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.2 + Math.random() * 0.6;
      ptPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      ptPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ptPos[i * 3 + 2] = r * Math.cos(phi);
      ptSpeeds.push({ theta, phi, r, speed: 0.003 + Math.random() * 0.005, phase: Math.random() * Math.PI * 2 });
    }
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
    const ptMat = new THREE.PointsMaterial({ color: "#E2978C", size: 0.035, transparent: true, opacity: 0.55 });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // ── Lighting ──────────────────────────────────────────────
    const keyLight = new THREE.DirectionalLight(0xfff0e8, 1.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xf6dace, 0.7);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xfce8dc, 0.6));

    // ── Animation loop ────────────────────────────────────────
    let currentScale = 1.0;
    let t = 0;
    let lastTime = performance.now();
    let rafId;

    function animate(now) {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      t += dt * 0.001;

      const { phaseIdx: pi, phases } = stateRef.current;
      const targetScale = phases[pi].scale;
      const phaseDur    = phases[pi].ms;

      // Time-based exponential lerp — reaches 99% of target in one phase duration
      const lerpFactor = 1 - Math.pow(0.01, dt / phaseDur);
      currentScale += (targetScale - currentScale) * lerpFactor;

      // ── Vertex morphing ───────────────────────────────────
      const pos = geo.attributes.position;
      const arr = pos.array;
      const strength = 0.045 + (currentScale - 1) * 0.04;
      for (let i = 0; i < arr.length; i += 3) {
        const ox = origPos[i], oy = origPos[i + 1], oz = origPos[i + 2];
        const d =
          Math.sin(ox * 4.1 + t * 0.65) * Math.cos(oy * 3.7 + t * 0.50) * Math.sin(oz * 5.0 + t * 0.85) * strength +
          Math.cos(ox * 2.0 + t * 0.30) * Math.sin(oy * 3.2 + t * 0.75) * Math.cos(oz * 2.6 + t * 0.40) * strength * 0.5;
        arr[i]     = ox + d;
        arr[i + 1] = oy + d;
        arr[i + 2] = oz + d;
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      // ── Scale ─────────────────────────────────────────────
      orb.scale.setScalar(currentScale);
      halo1.scale.setScalar(currentScale);
      halo2.scale.setScalar(currentScale * 1.01);
      halo3.scale.setScalar(currentScale * 1.02);

      // ── Halo glow tracks expansion ────────────────────────
      const glow = (currentScale - 1) / 0.3;
      halo1.material.opacity = 0.07 + glow * 0.12;
      halo2.material.opacity = 0.03 + glow * 0.07;
      halo3.material.opacity = 0.01 + glow * 0.04;

      // ── Emissive pulses on hold ───────────────────────────
      mat.emissiveIntensity = pi === 1
        ? 0.20 + Math.sin(t * 3.0) * 0.08   // gentle pulse while holding
        : 0.12 + glow * 0.18;

      // ── Particle drift ────────────────────────────────────
      const pa = ptGeo.attributes.position.array;
      for (let i = 0; i < ptCount; i++) {
        const s = ptSpeeds[i];
        s.theta += s.speed;
        const drift = 1.3 + currentScale * 0.25 + Math.sin(t * 0.6 + s.phase) * 0.08;
        pa[i * 3]     = drift * Math.sin(s.phi) * Math.cos(s.theta);
        pa[i * 3 + 1] = drift * Math.sin(s.phi) * Math.sin(s.theta);
        pa[i * 3 + 2] = drift * Math.cos(s.phi);
      }
      ptGeo.attributes.position.needsUpdate = true;
      ptMat.opacity = 0.35 + glow * 0.3;

      // ── Slow rotation ─────────────────────────────────────
      orb.rotation.y = t * 0.12;
      orb.rotation.z = Math.sin(t * 0.08) * 0.12;
      particles.rotation.y = -t * 0.06;

      renderer.render(scene, camera);
    }

    animate(performance.now());

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      [geo, mat, ptGeo, ptMat, halo1.geometry, halo1.material,
       halo2.geometry, halo2.material, halo3.geometry, halo3.material].forEach(o => o.dispose?.());
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: 240, height: 240, margin: "0 auto" }}
      aria-hidden="true"
    />
  );
}

export default function ImAWifeApp() {
  const [step, setStep] = useState(0);
  const [situationId, setSituationId] = useState(null);
  const [customText, setCustomText] = useState("");
  const [affIndex, setAffIndex] = useState(0);
  const [giftIds, setGiftIds] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("Something I wanted to share 💛");
  const [body, setBody] = useState("");
  const [bodyTouched, setBodyTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pastedLink, setPastedLink] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [shareableLink, setShareableLink] = useState("");

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const titles = {
      0: "I'm a Wife - A Soft Place to Land Before You Press Send",
      1: "What Happened? - Express Your Feelings",
      2: "Take a Breath - Mindful Pause",
      3: "Affirmations - You're Not Alone",
      4: "A Little Something - Self-Care Matters",
      5: "Tell Him Gently - Communicate With Care",
    };
    document.title = titles[step] || titles[0];
  }, [step]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autoSituation = params.get("situation");
    const autoGifts = params.get("gifts");
    const autoEmail = params.get("email");
    const autoName = params.get("name");
    const autoLink = params.get("link");

    if (autoSituation && autoEmail) {
      setSituationId(autoSituation);
      setRecipientEmail(autoEmail);
      if (autoName) setSenderName(autoName);
      if (autoGifts) setGiftIds(autoGifts.split(","));
      if (autoLink) setPastedLink(autoLink);

      setTimeout(() => {
        const bodyText = buildBodyForParams(autoSituation, autoGifts, autoLink, autoName);
        setBody(bodyText);
        setTimeout(() => sendEmailDirectly(autoEmail, autoName, bodyText), 500);
      }, 100);
    }
  }, []);

  async function sendEmailDirectly(email, name, bodyText) {
    // kept for URL auto-send param support
    try {
      const a = document.createElement("a");
      const params = new URLSearchParams({ subject: subject || "Something I wanted to share 💛", body: bodyText });
      a.href = `mailto:${email}?${params.toString()}`;
      a.click();
    } catch (_) {}
  }

  function buildBodyForParams(sitId, gifts, link, name) {
    const situation = SITUATIONS.find((s) => s.id === sitId);
    const phrase = situation?.phrase || "something happened earlier that I want to be honest about";
    let giftText = "";
    if (gifts) {
      const giftArray = gifts.split(",");
      const selectedGiftObjs = GIFT_OPTIONS.filter((g) => giftArray.includes(g.id));
      if (selectedGiftObjs.length > 0) {
        const labels = selectedGiftObjs.map((g) => g.label.toLowerCase());
        let joined =
          labels.length === 1 ? labels[0] :
          labels.length === 2 ? `${labels[0]} and ${labels[1]}` :
          `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
        giftText = `\n\nHonestly, ${joined} would go a long way right now.\n\n` +
          selectedGiftObjs.map((g) => `${g.label}: ${g.link}`).join("\n");
      }
    }
    const linkText = link ? `\n\nHere's something I wanted to share with you: ${link}` : "";
    return `Hey love,\n\nI had a moment today — ${phrase}. I'm not upset forever, I just didn't want to swallow it and pretend it didn't happen.\n\nI'm okay. I just needed a minute, and I took it instead of snapping at you.${giftText}${linkText}\n\n— ${name || "Me"}`;
  }

  useEffect(() => {
    if (step !== 2) return;
    const phase = BREATH_PHASES[phaseIdx];
    timeoutRef.current = setTimeout(() => {
      const next = (phaseIdx + 1) % BREATH_PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
    }, phase.ms);
    return () => clearTimeout(timeoutRef.current);
  }, [step, phaseIdx]);

  useEffect(() => {
    if (step === 5 && !bodyTouched) setBody(buildBody());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setAffIndex((i) => (i + 1) % AFFIRMATIONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  function situationPhrase() {
    const s = SITUATIONS.find((x) => x.id === situationId);
    if (!s) return "something happened earlier that I want to be honest about";
    if (s.id === "other") return customText.trim() || "something happened earlier that I want to be honest about";
    return s.phrase;
  }

  function selectedGifts() {
    return GIFT_OPTIONS.filter((g) => giftIds.includes(g.id));
  }

  function giftSentence() {
    const gifts = selectedGifts();
    if (gifts.length === 0) return null;
    const labels = gifts.map((g) => g.label.toLowerCase());
    let joined =
      labels.length === 1 ? labels[0] :
      labels.length === 2 ? `${labels[0]} and ${labels[1]}` :
      `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
    return `Honestly, ${joined} would go a long way right now.`;
  }

  function buildBody() {
    const gSentence = giftSentence();
    const linksBlock = selectedGifts().map((g) => `${g.label}: ${g.link}`).join("\n");
    const pastedLinkText = pastedLink ? `\nHere's something I wanted to share with you: ${pastedLink}` : "";
    return [
      "Hey love,",
      "",
      `I had a moment today — ${situationPhrase()}. I'm not upset forever, I just didn't want to swallow it and pretend it didn't happen.`,
      "",
      "I'm okay. I just needed a minute, and I took it instead of snapping at you.",
      gSentence ? "" : null,
      gSentence,
      linksBlock ? "" : null,
      linksBlock || null,
      pastedLinkText,
      "",
      `— ${senderName || "Me"}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  function toggleGift(id) {
    setGiftIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  function handleCopy() {
    navigator.clipboard?.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }


  function generateShareableLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      situation: situationId || "other",
      email: recipientEmail,
      name: senderName || "Your wife",
    });
    if (giftIds.length > 0) params.set("gifts", giftIds.join(","));
    if (pastedLink) params.set("link", pastedLink);
    const link = `${baseUrl}?${params.toString()}`;
    setShareableLink(link);
    return link;
  }

  function copyShareableLink() {
    navigator.clipboard?.writeText(shareableLink).then(() => {
      alert("Link copied! Share it anywhere to auto-send the message.");
    });
  }

  function generateStorySnippet() {
    const snippets = [
      "When you need a minute before you respond 💭",
      "Speaking up without starting a fight 💛",
      "Choosing honesty over silence ✨",
      "Your feelings matter, even the quiet ones 🌸",
      "Taking space instead of snapping back 🌙",
      "Because grown women don't slam doors 💪",
    ];
    const random = snippets[Math.floor(Math.random() * snippets.length)];
    return `${random}\n\nI used I'm a Wife to tell him how I really feel.\n${window.location.origin}`;
  }

  function shareToStory(platform) {
    const snippet = generateStorySnippet();
    if (platform === "copy") {
      navigator.clipboard?.writeText(snippet).then(() => alert("Story snippet copied! Paste it into your story."));
    } else if (platform === "instagram") {
      navigator.clipboard?.writeText(snippet);
      alert("Text copied! Open Instagram and paste into your story. 📸");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(snippet)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(snippet)}`, "_blank");
    }
  }

  function handleOpenMail() {
    const params = new URLSearchParams({ subject: subject || "Something I wanted to share 💛", body });
    window.location.href = `mailto:${recipientEmail}?${params.toString()}`;
  }

  function regenerate() {
    setBody(buildBody());
    setBodyTouched(false);
  }

  function handlePasteLink(e) {
    const text = e.clipboardData.getData("text");
    if (text.match(/https?:\/\//)) {
      setPastedLink(text);
      if (!bodyTouched) setTimeout(() => setBody(buildBody()), 100);
    }
  }

  const canContinueStep1 = situationId && (situationId !== "other" || customText.trim().length > 0);

  return (
    <div className="iaw-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="iaw-wrap">
        <div className="iaw-header">
          <div className="iaw-brand">
            <Heart size={16} color="#C96B5E" fill="#C96B5E" />
            <span className="iaw-brand-label">I'm a Wife</span>
          </div>
          {step > 0 && (
            <div className="iaw-steps">
              {STEP_LABELS.map((_, i) => (
                <div key={i} className={`iaw-step-dot${i + 1 === step ? " active" : ""}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="iaw-wrap">

        {/* Step 0 — Landing */}
        {step === 0 && (
          <div className="iaw-card iaw-fade" style={{ textAlign: "center", padding: "44px 32px" }}>
            <h1 className="iaw-title iaw-serif">
              A soft place to land<br />before you press send.
            </h1>
            <p className="iaw-sub" style={{ maxWidth: 340, margin: "0 auto 32px" }}>
              Name what happened, breathe for a minute, remember you're not the problem —
              then tell him about it like a grown woman instead of a slammed door.
            </p>
            <button className="iaw-btn iaw-btn-primary" onClick={() => setStep(1)}>
              Begin <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 1 — What happened */}
        {step === 1 && (
          <div className="iaw-card iaw-fade">
            <h2 className="iaw-heading iaw-serif">What happened?</h2>
            <p className="iaw-sub">Pick what's closest — you can say more in your own words after.</p>
            <div className="iaw-chip-list">
              {SITUATIONS.map((s) => (
                <button
                  key={s.id}
                  className={`iaw-chip${situationId === s.id ? " selected" : ""}`}
                  onClick={() => setSituationId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {situationId === "other" && (
              <textarea
                className="iaw-textarea"
                rows={3}
                placeholder="Tell it your way..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                style={{ marginBottom: 8, fontSize: 15 }}
              />
            )}
            <div className="iaw-nav">
              <button className="iaw-btn iaw-btn-ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="iaw-btn iaw-btn-primary"
                disabled={!canContinueStep1}
                onClick={() => { setStep(2); setPhaseIdx(0); setCycles(0); }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Breathe */}
        {step === 2 && (
          <div className="iaw-card iaw-fade" style={{ textAlign: "center" }}>
            <h2 className="iaw-heading iaw-serif">Just breathe for a second.</h2>
            <p className="iaw-sub">No rush. Stay as long as you want.</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "4px 0 20px" }}>
              <BreathingOrb phaseIdx={phaseIdx} phases={BREATH_PHASES} />
              <p className="iaw-serif" style={{ fontSize: 20, color: "#C96B5E", marginBottom: 5, marginTop: 4 }}>
                {BREATH_PHASES[phaseIdx].name}
              </p>
              <p style={{ fontSize: 12, color: "#9B708088" }}>
                {cycles} full cycle{cycles === 1 ? "" : "s"} done
              </p>
            </div>
            <div className="iaw-nav">
              <button className="iaw-btn iaw-btn-ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="iaw-btn iaw-btn-primary" onClick={() => { setStep(3); setAffIndex(0); }}>
                I'm ready <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Affirmations */}
        {step === 3 && (
          <div className="iaw-card iaw-fade" style={{ textAlign: "center" }}>
            <h2 className="iaw-heading iaw-serif">A few true things.</h2>
            <div className="iaw-progress-bar">
              <div className="iaw-progress-fill" />
            </div>
            <p className="iaw-aff-counter">{affIndex + 1} of {AFFIRMATIONS.length}</p>
            <div className="iaw-affirmation-box">
              <p className="iaw-affirmation-text">{AFFIRMATIONS[affIndex]}</p>
            </div>
            <div className="iaw-aff-controls">
              <button
                className="iaw-btn iaw-btn-ghost iaw-btn-sm"
                onClick={() => setAffIndex((i) => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length)}
              >
                Previous
              </button>
              <button
                className="iaw-btn iaw-btn-ghost iaw-btn-sm"
                onClick={() => setAffIndex((i) => (i + 1) % AFFIRMATIONS.length)}
              >
                Another one
              </button>
            </div>
            <div className="iaw-nav">
              <button className="iaw-btn iaw-btn-ghost" onClick={() => setStep(2)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="iaw-btn iaw-btn-primary" onClick={() => setStep(4)}>
                I feel a little better <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Gifts */}
        {step === 4 && (
          <div className="iaw-card iaw-fade">
            <h2 className="iaw-heading iaw-serif">A little something would help.</h2>
            <p className="iaw-sub">Pick whatever sounds good. He's buying.</p>
            <div className="iaw-gift-grid">
              {GIFT_OPTIONS.map((g) => {
                const Icon = g.icon;
                const sel = giftIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    className={`iaw-gift-chip${sel ? " selected" : ""}`}
                    onClick={() => toggleGift(g.id)}
                  >
                    <Icon size={22} />
                    {g.label}
                  </button>
                );
              })}
            </div>
            <div className="iaw-nav">
              <button className="iaw-btn iaw-btn-ghost" onClick={() => setStep(3)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="iaw-btn iaw-btn-primary" onClick={() => setStep(5)}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Tell him */}
        {step === 5 && (
          <div className="iaw-card iaw-fade">
            <h2 className="iaw-heading iaw-serif">Tell him, gently.</h2>
            <p className="iaw-sub">Edit anything you want — it's your voice, not a script.</p>

            {/* Link */}
            <div className="iaw-panel">
              <label className="iaw-field-label">Share a link (optional)</label>
              <div className="iaw-row">
                <input
                  className="iaw-input"
                  type="text"
                  placeholder="Paste any link here…"
                  value={pastedLink}
                  onChange={(e) => setPastedLink(e.target.value)}
                  onPaste={handlePasteLink}
                />
                {pastedLink && (
                  <button
                    className="iaw-btn iaw-btn-ghost iaw-btn-sm"
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => { setPastedLink(""); if (!bodyTouched) setBody(buildBody()); }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {pastedLink && (
                <p style={{ fontSize: 12, color: "#9B7080", marginTop: 7 }}>✓ Added to your note</p>
              )}
            </div>

            {/* Email fields */}
            <div className="iaw-panel">
              <div className="iaw-email-grid">
                <div>
                  <label className="iaw-field-label">His email</label>
                  <input
                    className="iaw-input"
                    type="email"
                    placeholder="him@email.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="iaw-field-label">Your name</label>
                  <input
                    className="iaw-input"
                    type="text"
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
              </div>
              <label className="iaw-field-label">Subject</label>
              <input
                className="iaw-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="iaw-panel">
              <div className="iaw-row-between" style={{ marginBottom: 10 }}>
                <label className="iaw-field-label" style={{ margin: 0 }}>Message</label>
                <button
                  style={{ fontSize: 12, color: "#C96B5E", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}
                  onClick={regenerate}
                >
                  <RefreshCcw size={12} /> Rewrite
                </button>
              </div>
              <textarea
                className="iaw-textarea"
                rows={9}
                value={body}
                onChange={(e) => { setBody(e.target.value); setBodyTouched(true); }}
              />
            </div>


            {/* Send actions */}
            <div className="iaw-send-actions">
              <div className="iaw-send-row">
                <button className="iaw-btn iaw-btn-ghost" onClick={() => setStep(4)}>
                  <ArrowLeft size={15} /> Back
                </button>
                <button className="iaw-btn iaw-btn-ghost" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                className="iaw-btn iaw-btn-primary"
                style={{ width: "100%" }}
                disabled={!recipientEmail}
                onClick={handleOpenMail}
              >
                <Mail size={15} /> Send Email
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="iaw-footer">
        Made with care, for the moments that don't need a fight to be heard.<br />
        Not a substitute for actually talking to him — just a softer way in.
      </p>
    </div>
  );
}
