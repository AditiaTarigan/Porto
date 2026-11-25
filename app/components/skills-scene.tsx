"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { Skill } from "@/app/portfolio-data";

type Props = { skills: Skill[] };
type SkillKey = { skill: Skill; body: THREE.Mesh; material: THREE.MeshStandardMaterial };

function makeLabelTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return null;

  const fontSize = Math.min(72, 390 / Math.max(label.length, 4));
  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = 12;
  context.fillStyle = "#ffffff";
  context.fillText(label, canvas.width / 2, canvas.height / 2, 460);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function SkillsScene({ skills }: Props) {
  const canvasHost = useRef<HTMLDivElement>(null);
  const skillKeys = useRef<SkillKey[]>([]);
  const renderScene = useRef<(() => void) | null>(null);
  const [selectedId, setSelectedId] = useState(skills[0]?.id ?? "");
  const selectedSkill = skills.find((skill) => skill.id === selectedId) ?? skills[0];

  useEffect(() => {
    const host = canvasHost.current;
    if (!host || skills.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const board = new THREE.Group();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "skills-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    camera.position.set(0, 5.2, 7.2);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xe8f6e5, 0x283127, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-3, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc7f36b, 18, 12);
    rimLight.position.set(4, 2, -3);
    scene.add(rimLight);

    const columns = Math.min(4, skills.length);
    const rows = Math.ceil(skills.length / columns);
    const spacing = 1.02;
    const boardWidth = columns * spacing + 0.22;
    const boardDepth = rows * spacing + 0.22;
    const baseGeometry = new RoundedBoxGeometry(boardWidth, 0.18, boardDepth, 4, 0.07);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: "#161e19", roughness: 0.5, metalness: 0.22 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.22;
    board.add(base);
    resources.add(baseGeometry);
    resources.add(baseMaterial);

    const keyGeometry = new RoundedBoxGeometry(0.88, 0.3, 0.88, 4, 0.08);
    resources.add(keyGeometry);

    skills.forEach((skill, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: skill.color,
        emissive: "#000000",
        roughness: 0.34,
        metalness: 0.08,
      });
      const body = new THREE.Mesh(keyGeometry, material);
      const row = Math.floor(index / columns);
      const column = index % columns;
      body.position.set((column - (columns - 1) / 2) * spacing, 0.02, (row - (rows - 1) / 2) * spacing);
      body.userData.skillId = skill.id;
      board.add(body);
      resources.add(material);

      const texture = makeLabelTexture(skill.label);
      if (texture) {
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), labelMaterial);
        label.rotation.x = -Math.PI / 2;
        label.position.set(body.position.x, 0.174, body.position.z);
        board.add(label);
        resources.add(texture);
        resources.add(labelMaterial);
        resources.add(label.geometry);
      }

      skillKeys.current.push({ skill, body, material });
    });

    board.rotation.x = -0.08;
    scene.add(board);

    const draw = () => renderer.render(scene, camera);
    renderScene.current = draw;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      draw();
    };

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(host);
    window.addEventListener("resize", resize);
    resize();
    host.dataset.ready = "true";

    const canvas = renderer.domElement;
    let start: { x: number; y: number } | null = null;
    let dragged = false;

    const onPointerDown = (event: PointerEvent) => {
      start = { x: event.clientX, y: event.clientY };
      dragged = false;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!start) return;
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 3) dragged = true;
      if (!dragged) return;

      board.rotation.y += deltaX * 0.009;
      board.rotation.x = THREE.MathUtils.clamp(board.rotation.x + deltaY * 0.006, -0.48, 0.2);
      start = { x: event.clientX, y: event.clientY };
      draw();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (start && !dragged) {
        const bounds = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(skillKeys.current.map(({ body }) => body))[0];
        if (hit) setSelectedId(String(hit.object.userData.skillId));
      }

      start = null;
      canvas.style.cursor = "grab";
    };

    const onPointerCancel = () => {
      start = null;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.style.cursor = "grab";
    draw();

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      canvas.remove();
      host.dataset.ready = "false";
      skillKeys.current = [];
      renderScene.current = null;
    };
  }, [skills]);

  useEffect(() => {
    skillKeys.current.forEach(({ skill, body, material }) => {
      const isSelected = skill.id === selectedId;
      body.scale.setScalar(isSelected ? 1.04 : 1);
      material.emissive.set(isSelected ? skill.color : "#000000");
      material.emissiveIntensity = isSelected ? 0.2 : 0;
    });
    renderScene.current?.();
  }, [selectedId]);

  return (
    <div className="skills-showcase">
      <div className="skills-canvas-wrap">
        <div ref={canvasHost} className="skills-canvas" data-ready="false" aria-hidden="true" />
        <p className="scene-fallback">Tampilan 3D tidak tersedia di perangkat ini. Skill tetap dapat dipilih dari panel.</p>
      </div>

      <div className="skills-panel">
        <div className="skills-selected" aria-live="polite">
          <p className="eyebrow">SKILL TERPILIH</p>
          <h3>{selectedSkill?.label ?? "Pilih skill"}</h3>
          <p>{selectedSkill?.description ?? "Pilih salah satu skill untuk melihat detailnya."}</p>
        </div>
        <ul className="skills-list" aria-label="Daftar skills">
          {skills.map((skill) => (
            <li key={skill.id}>
              <button
                className="skill-choice"
                type="button"
                aria-pressed={skill.id === selectedSkill?.id}
                onClick={() => setSelectedId(skill.id)}
              >
                <span className="skill-choice-swatch" style={{ "--swatch": skill.color } as CSSProperties} />
                {skill.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
