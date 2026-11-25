"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { skills, type Skill } from "@/app/data/portfolio";

const ActiveSkillContext = createContext<Skill | null>(null);
type KeyboardInteraction = { isPressed: boolean; showSkill: (skill: Skill) => void };
const KeyboardInteractionContext = createContext<KeyboardInteraction>({ isPressed: false, showSkill: () => {} });
export const useActiveSkill = () => useContext(ActiveSkillContext);
export const useKeyboardPress = () => useContext(KeyboardInteractionContext).isPressed;
export const useShowSkill = () => useContext(KeyboardInteractionContext).showSkill;

type Props = { children: ReactNode };
type KeyRecord = { skill: Skill; pivot: THREE.Group; body: THREE.Mesh; material: THREE.MeshStandardMaterial; hovered: boolean; pressed: boolean };
type Pose = { x: number; y: number; scale: number; rx: number; ry: number; rz: number };

function makeMarkTexture(skill: Skill) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 ${skill.mark.length > 2 ? 62 : 92}px Arial, sans-serif`;
  context.shadowColor = "rgba(0, 0, 0, .45)";
  context.shadowBlur = 12;
  context.fillStyle = "#fff";
  context.fillText(skill.mark, 128, 128, 220);
  context.shadowBlur = 0;
  context.font = "700 25px Arial, sans-serif";
  context.textAlign = "right";
  context.fillStyle = "rgba(255,255,255,.72)";
  context.fillText(skill.hotkey.toUpperCase(), 235, 238);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function readPose(scrollY: number, anchors: number[], width: number): Pose {
  const compact = width < 20;
  const poses: Pose[] = [
    { x: width * 0.27, y: 0.1, scale: compact ? 0.42 : 0.57, rx: 0.68, ry: -0.45, rz: -0.1 },
    compact
      ? { x: width * 0.24, y: 2.55, scale: 0.45, rx: 0.72, ry: -0.32, rz: 0 }
      : { x: width * 0.08, y: -0.15, scale: 0.93, rx: 0.76, ry: -0.32, rz: 0 },
    compact
      ? { x: width * 0.27, y: 2.7, scale: 0.4, rx: 0.55, ry: 0.4, rz: -0.08 }
      : { x: width * 0.24, y: 1.45, scale: 0.57, rx: 0.55, ry: 0.4, rz: -0.08 },
    compact
      ? { x: width * 0.27, y: 0.2, scale: 0.38, rx: 0.68, ry: -0.55, rz: 0.1 }
      : { x: -width * 0.25, y: 0.05, scale: 0.52, rx: 0.68, ry: -0.55, rz: 0.1 },
  ];
  let index = 0;
  while (index < anchors.length - 1 && scrollY >= anchors[index + 1]) index++;
  if (index === anchors.length - 1) return poses[index];
  const span = Math.max(1, anchors[index + 1] - anchors[index]);
  const raw = THREE.MathUtils.clamp((scrollY - anchors[index]) / span, 0, 1);
  const t = raw * raw * (3 - 2 * raw);
  const from = poses[index];
  const to = poses[index + 1];
  return {
    x: THREE.MathUtils.lerp(from.x, to.x, t),
    y: THREE.MathUtils.lerp(from.y, to.y, t),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, t),
    rx: THREE.MathUtils.lerp(from.rx, to.rx, t),
    ry: THREE.MathUtils.lerp(from.ry, to.ry, t),
    rz: THREE.MathUtils.lerp(from.rz, to.rz, t),
  };
}

export default function KeyboardWorld({ children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const selectedSkillId = useRef<string | null>(null);
  const dismissTimer = useRef<number | null>(null);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState(false);

  const showSkill = (skill: Skill, pressed = false) => {
    if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
    selectedSkillId.current = skill.id;
    setActiveSkill(skill);
    setIsPressed(pressed);
    if (!pressed) {
      dismissTimer.current = window.setTimeout(() => {
        selectedSkillId.current = null;
        setActiveSkill(null);
        dismissTimer.current = null;
      }, 1600);
    }
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.innerWidth > 720, powerPreference: "low-power" });
    } catch (error) {
      console.error("Three.js could not create a WebGL renderer:", error);
      const timer = window.setTimeout(() => {
        setWebglError(true);
        setProgress(100);
        setReady(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const keyboard = new THREE.Group();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const keys: KeyRecord[] = [];
    const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let contextLost = false;
    let animationFrame = 0;
    let buildFrame = 0;
    let hovered: KeyRecord | null = null;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x050508, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "keyboard-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      console.error("Three.js lost its WebGL context.");
      setWebglError(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    camera.position.set(0, 0, 13);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xe8edff, 0x1b1422, 1.5));
    const keyLight = new THREE.DirectionalLight(0xffefde, 3.3);
    keyLight.position.set(-4, 7, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const glowLight = new THREE.PointLight(0x6c66ff, 24, 18);
    glowLight.position.set(5, 2, 5);
    scene.add(glowLight);

    const boardGeometry = new RoundedBoxGeometry(5.32, 5.32, 0.3, 5, 0.12);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: "#171920", roughness: 0.3, metalness: 0.55 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.z = -0.16;
    board.receiveShadow = true;
    keyboard.add(board);
    resources.add(boardGeometry);
    resources.add(boardMaterial);

    const shadowGeometry = new THREE.PlaneGeometry(12, 12);
    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.28 });
    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.position.z = -0.34;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    resources.add(shadowGeometry);
    resources.add(shadowMaterial);

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 24;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPositions[i * 3 + 2] = -2 - Math.random() * 6;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xd1d4ff, size: 0.025, transparent: true, opacity: 0.56 });
    scene.add(new THREE.Points(starsGeometry, starsMaterial));
    resources.add(starsGeometry);
    resources.add(starsMaterial);

    const capGeometry = new RoundedBoxGeometry(0.94, 0.82, 0.34, 5, 0.09);
    resources.add(capGeometry);

    const releaseKey = (key: KeyRecord) => {
      key.pressed = false;
      setIsPressed(false);
      if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
      dismissTimer.current = window.setTimeout(() => {
        selectedSkillId.current = null;
        setActiveSkill((current) => current?.id === key.skill.id ? null : current);
        dismissTimer.current = null;
      }, 1100);
    };

    const addKey = (skill: Skill, index: number) => {
      const material = new THREE.MeshStandardMaterial({
        color: skill.color,
        roughness: 0.22,
        metalness: 0.08,
        emissive: skill.color,
        emissiveIntensity: 0.04,
      });
      const pivot = new THREE.Group();
      const row = Math.floor(index / 5);
      const column = index % 5;
      pivot.position.set((column - 2) * 1.04, (2 - row) * 1.04, 0.08);
      const body = new THREE.Mesh(capGeometry, material);
      body.castShadow = true;
      body.receiveShadow = true;
      pivot.add(body);
      body.userData.skillId = skill.id;
      const texture = makeMarkTexture(skill);
      if (texture) {
        const markMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, depthWrite: false });
        const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.56), markMaterial);
        mark.position.z = 0.177;
        pivot.add(mark);
        resources.add(texture);
        resources.add(mark.geometry);
        resources.add(markMaterial);
      }
      keyboard.add(pivot);
      resources.add(material);
      keys.push({ skill, pivot, body, material, hovered: false, pressed: false });
      if ((index + 1) % 5 === 0 || index + 1 === skills.length) setProgress(Math.round(((index + 1) / skills.length) * 100));
    };

    const render = () => renderer.render(scene, camera);
    const anchors = [0, 0, 0, 0];
    let viewWidth = 1;
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      viewWidth = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * camera.aspect;
      ["home", "skills", "projects", "contact"].forEach((id, index) => {
        const section = document.getElementById(id);
        anchors[index] = index === 0 || !section ? 0 : section.getBoundingClientRect().top + window.scrollY - height * 0.34;
      });
      render();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (stickerRef.current) stickerRef.current.style.transform = `translate3d(${event.clientX + 13}px, ${event.clientY + 13}px, 0)`;
      const canvas = renderer.domElement;
      const bounds = canvas.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(keys.map((key) => key.body))[0];
      const next = hit ? keys.find((key) => key.skill.id === hit.object.userData.skillId) ?? null : null;
      if (hovered !== next) {
        if (hovered) hovered.hovered = false;
        hovered = next;
        if (hovered) hovered.hovered = true;
      }
    };
    let pointerKey: KeyRecord | null = null;
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest?.("a, button, input, textarea, select")) return;
      onPointerMove(event);
      if (!hovered) return;
      pointerKey = hovered;
      pointerKey.pressed = true;
      showSkill(pointerKey.skill, true);
    };
    const onPointerUp = () => {
      if (pointerKey) releaseKey(pointerKey);
      pointerKey = null;
    };
    const keyByHotkey = new Map(skills.map((skill) => [skill.hotkey.toLowerCase(), skill.id]));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || /input|textarea|select/i.test((event.target as HTMLElement)?.tagName ?? "")) return;
      const skillId = keyByHotkey.get(event.key.toLowerCase());
      const key = keys.find((item) => item.skill.id === skillId);
      if (!key) return;
      key.pressed = true;
      showSkill(key.skill, true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const skillId = keyByHotkey.get(event.key.toLowerCase());
      const key = keys.find((item) => item.skill.id === skillId);
      if (key?.pressed) releaseKey(key);
    };

    const clock = new THREE.Clock();
    const animate = () => {
      if (disposed || contextLost) return;
      const delta = Math.min(clock.getDelta(), 0.04);
      const width = viewWidth;
      const target = readPose(window.scrollY, anchors, width);
      const ease = reducedMotion.matches ? 1 : 1 - Math.exp(-delta * 7.5);
      keyboard.position.x = THREE.MathUtils.lerp(keyboard.position.x, target.x, ease);
      keyboard.position.y = THREE.MathUtils.lerp(keyboard.position.y, target.y, ease);
      keyboard.scale.setScalar(THREE.MathUtils.lerp(keyboard.scale.x, target.scale, ease));
      keyboard.rotation.x = THREE.MathUtils.lerp(keyboard.rotation.x, target.rx, ease);
      keyboard.rotation.y = THREE.MathUtils.lerp(keyboard.rotation.y, target.ry, ease);
      keyboard.rotation.z = THREE.MathUtils.lerp(keyboard.rotation.z, target.rz, ease);
      for (const key of keys) {
        const selected = selectedSkillId.current === key.skill.id;
        const offset = key.pressed ? -0.075 : key.hovered ? 0.11 : 0;
        key.pivot.position.z = THREE.MathUtils.lerp(key.pivot.position.z, 0.08 + offset, 1 - Math.exp(-delta * 18));
        key.material.emissiveIntensity = THREE.MathUtils.lerp(key.material.emissiveIntensity, key.pressed ? 0.34 : key.hovered ? 0.2 : selected ? 0.18 : 0.04, 1 - Math.exp(-delta * 14));
      }
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    keyboard.rotation.set(0.68, -0.45, -0.1);
    scene.add(keyboard);
    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let keyIndex = 0;
    const buildNextKey = () => {
      if (disposed) return;
      addKey(skills[keyIndex], keyIndex);
      keyIndex++;
      if (keyIndex < skills.length) buildFrame = requestAnimationFrame(buildNextKey);
      else {
        setReady(true);
        animationFrame = requestAnimationFrame(animate);
      }
    };
    buildFrame = requestAnimationFrame(buildNextKey);

    return () => {
      disposed = true;
      if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(buildFrame);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    document.documentElement.classList.add("motion-ready");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("motion-ready");
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -4% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return (
    <ActiveSkillContext.Provider value={activeSkill}>
      <KeyboardInteractionContext.Provider value={{ isPressed, showSkill: (skill) => showSkill(skill) }}>
      <div className="keyboard-world" aria-hidden="true"><div ref={hostRef} className="keyboard-world-host" /></div>
      <div ref={stickerRef} className="cursor-sticker" aria-hidden="true">✳<span>AD</span></div>
      {activeSkill && (
        <aside className="active-skill" aria-live="polite">
          <span className="active-skill-kicker">KEY {activeSkill.hotkey.toUpperCase()} / PRESSED</span>
          <h2>{activeSkill.name}</h2>
          <p>{activeSkill.line}</p>
        </aside>
      )}
      {!ready && (
        <div className="preloader" role="status" aria-label={`Memuat keyboard 3D ${progress}%`}>
          <div className="preloader-mark">AD<span>.</span></div>
          <p>Portofolio</p>
          <div className="preloader-track"><span style={{ width: `${progress}%` }} /></div>
          <small>{String(progress).padStart(2, "0")} / 100</small>
        </div>
      )}
      {webglError && (
        <div className="keyboard-fallback" aria-hidden="true">
          <div className="keyboard-fallback-grid">
            {skills.map((skill) => <span key={skill.id} style={{ backgroundColor: skill.color }}>{skill.mark}</span>)}
          </div>
          <p>WebGL unavailable · showing a static keyboard</p>
        </div>
      )}
      {children}
      </KeyboardInteractionContext.Provider>
    </ActiveSkillContext.Provider>
  );
}
