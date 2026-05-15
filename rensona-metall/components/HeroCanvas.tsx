"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ── Scroll phases ──────────────────────────────────────────────────────────
 *  0.00 → 0.30  INGOT     copper ingots at rest
 *  0.30 → 0.58  EXPLODE   radial scatter
 *  0.58 → 0.85  CABLES    helix formation
 *  0.85 → 1.00  DONE      cables hold
 * ─────────────────────────────────────────────────────────────────────────*/

function eio(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Trapezoid prism (ingot shape) — sample a random point on any of 6 faces
function sampleIngot(out: Float32Array, offset: number, ox: number, oy: number, oz: number) {
  const bW = 1.9, bD = 0.8, tW = 1.55, tD = 0.62;
  const bY = -0.28, tY = 0.28;

  const face = Math.floor(Math.random() * 6);
  let x = 0, y = 0, z = 0;

  if (face === 0) { // bottom
    x = (Math.random() - 0.5) * bW;
    y = bY;
    z = (Math.random() - 0.5) * bD;
  } else if (face === 1) { // top
    x = (Math.random() - 0.5) * tW;
    y = tY;
    z = (Math.random() - 0.5) * tD;
  } else { // four sides — lerp between bottom and top edge
    const t = Math.random();
    const lW = lerp(bW, tW, t) / 2;
    const lD = lerp(bD, tD, t) / 2;
    y = lerp(bY, tY, t);
    if (face === 2) { x = lW;  z = (Math.random() - 0.5) * lerp(bD, tD, t); }
    else if (face === 3) { x = -lW; z = (Math.random() - 0.5) * lerp(bD, tD, t); }
    else if (face === 4) { z = lD;  x = (Math.random() - 0.5) * lerp(bW, tW, t); }
    else               { z = -lD; x = (Math.random() - 0.5) * lerp(bW, tW, t); }
  }

  out[offset]     = x + ox;
  out[offset + 1] = y + oy;
  out[offset + 2] = z + oz;
}

function sampleExplode(out: Float32Array, offset: number) {
  const r = 2.8 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  out[offset]     = r * Math.sin(phi) * Math.cos(theta);
  out[offset + 1] = r * Math.sin(phi) * Math.sin(theta);
  out[offset + 2] = r * Math.cos(phi);
}

function sampleCable(out: Float32Array, offset: number, index: number, total: number) {
  const strand = index % 3;
  const yOffset = [-0.72, 0, 0.72][strand];
  const helixRadius = 0.18;
  const turns = 9;
  const t = (Math.floor(index / 3) / Math.floor(total / 3)) + Math.random() * 0.01;
  const angle = t * turns * Math.PI * 2;
  const x = lerp(-2.8, 2.8, t);
  out[offset]     = x + Math.cos(angle) * helixRadius * 0.4;
  out[offset + 1] = yOffset + Math.sin(angle) * helixRadius;
  out[offset + 2] = Math.cos(angle + Math.PI) * helixRadius * 0.4;
}

export function HeroCanvas({ scrollProgress }: { scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    particles: THREE.Points;
    ingotGroup: THREE.Group;
    posIngot: Float32Array;
    posExplode: Float32Array;
    posCable: Float32Array;
    posCur: Float32Array;
    pLight: THREE.PointLight;
    frameId: number;
  } | null>(null);

  // Init Three.js once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth <= 640;
    const NP = isMobile ? 400 : 800;
    const ingotX = isMobile ? 0 : 2.4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Scene & camera
    const scene  = new THREE.Scene();
    const fov    = isMobile ? 55 : 44;
    const camera = new THREE.PerspectiveCamera(fov, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 9 : 7.5);

    // Lights
    scene.add(new THREE.AmbientLight(0x1a0a04, 0.8));
    const key = new THREE.DirectionalLight(0xffcca0, 3.8);
    key.position.set(3, 4, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x334466, 0.5);
    fill.position.set(-3, 0, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xff7733, 1.5);
    rim.position.set(-1, -2, -3);
    scene.add(rim);
    const pLight = new THREE.PointLight(0xff6622, 4, 12);
    pLight.position.set(0, 2, 3);
    scene.add(pLight);
    const pLight2 = new THREE.PointLight(0xd4803a, 2, 14);
    pLight2.position.set(-2, -1, 2);
    scene.add(pLight2);

    // ── Ingot meshes ──────────────────────────────────────────────────────
    const ingotGroup = new THREE.Group();
    ingotGroup.position.x = ingotX;

    function makeIngotMesh(yOffset: number) {
      const bW = 1.9, bD = 0.8, tW = 1.55, tD = 0.62;
      const bY = -0.28, tY = 0.28;
      const geo = new THREE.BufferGeometry();
      const verts: number[] = [];
      const norms: number[] = [];
      const push6 = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number, nx: number, ny: number, nz: number) => {
        verts.push(ax, ay, az, bx, by, bz, cx, cy, cz);
        norms.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
      };
      // bottom
      push6(-bW/2,bY,-bD/2,  bW/2,bY,-bD/2,  bW/2,bY,bD/2,  0,-1,0);
      push6(-bW/2,bY,-bD/2,  bW/2,bY,bD/2,  -bW/2,bY,bD/2,  0,-1,0);
      // top
      push6(-tW/2,tY,-tD/2,  tW/2,tY,tD/2,  tW/2,tY,-tD/2,  0,1,0);
      push6(-tW/2,tY,-tD/2,  -tW/2,tY,tD/2, tW/2,tY,tD/2,   0,1,0);
      // front (z+)
      push6(-bW/2,bY,bD/2,  bW/2,bY,bD/2,  tW/2,tY,tD/2,   0,0.15,0.99);
      push6(-bW/2,bY,bD/2,  tW/2,tY,tD/2,  -tW/2,tY,tD/2,  0,0.15,0.99);
      // back
      push6(bW/2,bY,-bD/2, -bW/2,bY,-bD/2, -tW/2,tY,-tD/2, 0,0.15,-0.99);
      push6(bW/2,bY,-bD/2, -tW/2,tY,-tD/2, tW/2,tY,-tD/2,  0,0.15,-0.99);
      // right
      push6(bW/2,bY,bD/2,  bW/2,bY,-bD/2,  tW/2,tY,-tD/2,  0.99,0.15,0);
      push6(bW/2,bY,bD/2,  tW/2,tY,-tD/2,  tW/2,tY,tD/2,   0.99,0.15,0);
      // left
      push6(-bW/2,bY,-bD/2, -bW/2,bY,bD/2,  -tW/2,tY,tD/2, -0.99,0.15,0);
      push6(-bW/2,bY,-bD/2, -tW/2,tY,tD/2,  -tW/2,tY,-tD/2,-0.99,0.15,0);

      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
      geo.setAttribute("normal",   new THREE.BufferAttribute(new Float32Array(norms), 3));

      const mat = new THREE.MeshStandardMaterial({
        color: 0xb06030,
        metalness: 0.96,
        roughness: 0.26,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = yOffset;
      return mesh;
    }

    ingotGroup.add(makeIngotMesh(0.3));
    ingotGroup.add(makeIngotMesh(-0.38));
    ingotGroup.add(makeIngotMesh(-1.42));
    scene.add(ingotGroup);

    // ── Particle positions ─────────────────────────────────────────────────
    const posIngot   = new Float32Array(NP * 3);
    const posExplode = new Float32Array(NP * 3);
    const posCable   = new Float32Array(NP * 3);
    const posCur     = new Float32Array(NP * 3);

    const ingotOffsets = [
      [ingotX, 0.3,   0],
      [ingotX, -0.38, 0],
      [ingotX, -1.42, 0],
    ];

    for (let i = 0; i < NP; i++) {
      const which = i % 3;
      const [ox, oy, oz] = ingotOffsets[which];
      sampleIngot(posIngot, i * 3, ox, oy, oz);
      sampleExplode(posExplode, i * 3);
      sampleCable(posCable, i * 3, i, NP);
    }
    posIngot.forEach((v, i) => (posCur[i] = v));

    // Particle geometry & material
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(posCur.slice(), 3));

    const mat = new THREE.PointsMaterial({
      color: 0xd4823a,
      size: isMobile ? 0.045 : 0.038,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Resize handler
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Render loop
    let frameId = 0;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.016;
      pLight.intensity = 4 + Math.sin(t * 1.8) * 0.8;
      renderer.render(scene, camera);
    };
    animate();

    stateRef.current = { renderer, scene, camera, particles, ingotGroup, posIngot, posExplode, posCable, posCur, pLight, frameId };

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Drive animation from scrollProgress prop
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    const { particles, ingotGroup, posIngot, posExplode, posCable, posCur } = s;
    const NP = posIngot.length / 3;
    const p = scrollProgress;

    // Determine phase
    let posA: Float32Array, posB: Float32Array, phaseT: number;

    if (p < 0.30) {
      // Ingot phase — hold
      posA = posIngot; posB = posIngot; phaseT = 0;
      ingotGroup.visible = true;
      (particles.material as THREE.PointsMaterial).opacity = 1 - eio(p / 0.30) * 0.7;
    } else if (p < 0.58) {
      // Ingot → Explode
      const t = (p - 0.30) / (0.58 - 0.30);
      posA = posIngot; posB = posExplode; phaseT = t;
      ingotGroup.visible = false;
      (particles.material as THREE.PointsMaterial).opacity = 1;
    } else if (p < 0.85) {
      // Explode → Cable
      const t = (p - 0.58) / (0.85 - 0.58);
      posA = posExplode; posB = posCable; phaseT = t;
      ingotGroup.visible = false;
      (particles.material as THREE.PointsMaterial).opacity = 1;
    } else {
      // Cable hold
      posA = posCable; posB = posCable; phaseT = 1;
      ingotGroup.visible = false;
      (particles.material as THREE.PointsMaterial).opacity = 1;
    }

    const et = eio(Math.min(phaseT, 1));
    for (let i = 0; i < NP * 3; i++) {
      posCur[i] = posA[i] + (posB[i] - posA[i]) * et;
    }

    const attr = particles.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.array.set(posCur);
    attr.needsUpdate = true;
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
