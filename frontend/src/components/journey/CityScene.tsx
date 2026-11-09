// frontend/src/components/journey/CityScene.tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { CITIES, progressToStop, type City } from "./cities";
import { Landmark } from "./Landmarks";

/* ---------------- helpers ---------------- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Areas where filler buildings must not spawn (relative to the city center). */
function blocked(city: City, dx: number, dz: number) {
  const r = Math.hypot(dx, dz);
  switch (city.id) {
    case "sf":
      return Math.abs(dz) < 12.5 || r < 5;
    case "saopaulo":
      return (Math.abs(dz) < 4.5 && Math.abs(dx) < 18) || r < 3;
    case "seoul":
      return r < 11.5;
    case "thailand":
      return r < 9.5;
    case "panama":
      return r < 9.5;
    case "ny":
      return r < 6.5;
    default:
      return r < 5;
  }
}

/* ---------------- filler city ---------------- */

function Buildings() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const items = useMemo(() => {
    const out: { p: THREE.Vector3; s: THREE.Vector3; c: THREE.Color }[] = [];
    const palette = ["#4a4d5c", "#565a6b", "#3e4150", "#626677", "#4f5568"].map((h) => new THREE.Color(h));
    CITIES.forEach((city, ci) => {
      const rand = rng(1000 + ci * 97);
      let placed = 0;
      let tries = 0;
      while (placed < city.density && tries < city.density * 12) {
        tries++;
        const ang = rand() * Math.PI * 2;
        const rad = 4 + rand() * 18;
        const dx = Math.cos(ang) * rad;
        const dz = Math.sin(ang) * rad;
        if (blocked(city, dx, dz)) continue;
        const w = 1.4 + rand() * 2.4;
        const d = 1.4 + rand() * 2.4;
        // taller near the center, shorter at the edge
        const h = 1 + rand() * city.maxHeight * (1 - rad / 26);
        out.push({
          p: new THREE.Vector3(city.pos[0] + dx, h / 2, city.pos[1] + dz),
          s: new THREE.Vector3(w, h, d),
          c: palette[Math.floor(rand() * palette.length)],
        });
        placed++;
      }
    });
    return out;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    items.forEach((it, i) => {
      m.compose(it.p, q, it.s);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, it.c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial flatShading roughness={0.9} />
    </instancedMesh>
  );
}

/* ---------------- camera rig ---------------- */

function useCameraPath() {
  return useMemo(() => {
    const cx = CITIES.reduce((a, c) => a + c.pos[0], 0) / CITIES.length;
    const cz = CITIES.reduce((a, c) => a + c.pos[1], 0) / CITIES.length;
    const first = CITIES[0];

    const positions = [
      new THREE.Vector3(first.pos[0] - 30, 42, first.pos[1] + 55), // opening overview
      ...CITIES.map((c) => {
        const k = 1 + c.lookY / 16;
        return new THREE.Vector3(c.pos[0] - 15 * k, c.lookY + 7 * k, c.pos[1] + 24 * k);
      }),
      new THREE.Vector3(cx - 30, 115, cz + 135), // closing overview of the whole city
    ];
    const targets = [
      new THREE.Vector3(first.pos[0] + 30, 0, first.pos[1] - 20),
      ...CITIES.map((c) => new THREE.Vector3(c.pos[0], c.lookY, c.pos[1])),
      new THREE.Vector3(cx, 0, cz),
    ];
    return {
      pos: new THREE.CatmullRomCurve3(positions, false, "centripetal"),
      look: new THREE.CatmullRomCurve3(targets, false, "centripetal"),
    };
  }, []);
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera, scene } = useThree();
  const path = useCameraPath();
  const curPos = useRef(new THREE.Vector3());
  const curLook = useRef(new THREE.Vector3());
  const ready = useRef(false);
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpL = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const { t } = progressToStop(progress.get());
    path.pos.getPoint(t, tmpP);
    path.look.getPoint(t, tmpL);

    // Pull back a bit on narrow (portrait) screens so landmarks fit.
    const aspect = (camera as THREE.PerspectiveCamera).aspect || 1;
    if (aspect < 1) tmpP.lerp(tmpL, -(1 / aspect - 1) * 0.45);

    if (!ready.current) {
      curPos.current.copy(tmpP);
      curLook.current.copy(tmpL);
      ready.current = true;
    } else {
      const k = 1 - Math.exp(-dt * 4);
      curPos.current.lerp(tmpP, k);
      curLook.current.lerp(tmpL, k);
    }
    camera.position.copy(curPos.current);
    camera.lookAt(curLook.current);

    // Open the fog up for the final wide shot.
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      // wide at the opening and closing overviews, tighter between cities
      const wide = Math.max(1 - THREE.MathUtils.smoothstep(t, 0, 0.1), THREE.MathUtils.smoothstep(t, 0.86, 1));
      fog.near = THREE.MathUtils.lerp(35, 140, wide);
      fog.far = THREE.MathUtils.lerp(130, 420, wide);
    }
  });

  return null;
}

/* ---------------- scene ---------------- */

const BG = "#0b0b10";

export default function CityScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.5, far: 900, position: [-60, 70, 90] }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 35, 130]} />

      <hemisphereLight args={["#c8d1ff", "#2a2a36", 1.0]} />
      <directionalLight
        position={[120, 160, 80]}
        intensity={2.2}
        color="#ffe2c2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-far={500}
      />

      {/* ground + district pads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[140, 0, -30]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial color="#191921" roughness={1} />
      </mesh>
      {CITIES.map((c) => (
        <mesh key={c.id} rotation={[-Math.PI / 2, 0, 0]} position={[c.pos[0], 0.01, c.pos[1]]} receiveShadow>
          <circleGeometry args={[23, 28]} />
          <meshStandardMaterial color="#23232e" roughness={1} />
        </mesh>
      ))}

      <Buildings />
      {CITIES.map((c) => (
        <group key={c.id} position={[c.pos[0], 0, c.pos[1]]}>
          <Landmark id={c.id} />
        </group>
      ))}

      <CameraRig progress={progress} />
    </Canvas>
  );
}
