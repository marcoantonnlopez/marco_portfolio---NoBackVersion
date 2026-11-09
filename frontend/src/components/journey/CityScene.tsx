// frontend/src/components/journey/CityScene.tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { DISTRICTS, STOPS, STOP_COUNT, progressToStop, type District, type LandmarkId } from "./cities";
import { Landmark } from "./Landmarks";

/* ---------------- helpers ---------------- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Keep filler buildings off each landmark's footprint (dx/dz relative to the landmark). */
function blockedByLandmark(id: LandmarkId, dx: number, dz: number) {
  const r = Math.hypot(dx, dz);
  switch (id) {
    case "saopaulo":
      return (Math.abs(dz) < 4.5 && Math.abs(dx) < 18) || r < 3;
    case "seoul":
      return r < 11.5;
    case "thailand":
    case "panama":
      return r < 9.5;
    case "toronto":
      return r < 4.5;
    default:
      return r < 5;
  }
}

function blocked(d: District, dx: number, dz: number) {
  return d.landmarks.some((l) => blockedByLandmark(l.id, dx - l.offset[0], dz - l.offset[1]));
}

/* ---------------- layout: scattered districts → one avenue ---------------- */

const CX = DISTRICTS.reduce((a, c) => a + c.pos[0], 0) / DISTRICTS.length;
const CZ = DISTRICTS.reduce((a, c) => a + c.pos[1], 0) / DISTRICTS.length;

/** The avenue runs along -z at x = AVENUE_X; districts line up on alternating sides. */
const AVENUE_X = CX;
const AVENUE_Z0 = CZ + 10;
const AVENUE_STEP = 48;
const AVENUE_LEN = AVENUE_STEP * DISTRICTS.length + 120;

const MERGED: [number, number][] = DISTRICTS.map((d, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return [AVENUE_X + side * (23 * d.zoom + 4), AVENUE_Z0 - i * AVENUE_STEP];
});

/** 0 → 1 while scrolling from the last district to the closing shot. */
function mergeAmount(u: number) {
  return THREE.MathUtils.smoothstep(u, STOP_COUNT - 2 + 0.12, STOP_COUNT - 1 - 0.1);
}

/* ---------------- a district: pad + filler buildings + landmarks ---------------- */

const PALETTE = ["#4a4d5c", "#565a6b", "#3e4150", "#626677", "#4f5568"].map((h) => new THREE.Color(h));

function DistrictBuildings({ district, seed }: { district: District; seed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const items = useMemo(() => {
    const out: { p: THREE.Vector3; s: THREE.Vector3; c: THREE.Color }[] = [];
    const rand = rng(1000 + seed * 97);
    let placed = 0;
    let tries = 0;
    while (placed < district.density && tries < district.density * 12) {
      tries++;
      const ang = rand() * Math.PI * 2;
      const rad = 4 + rand() * 18 * district.zoom;
      const dx = Math.cos(ang) * rad;
      const dz = Math.sin(ang) * rad;
      if (blocked(district, dx, dz)) continue;
      const w = 1.4 + rand() * 2.4;
      const d = 1.4 + rand() * 2.4;
      // taller near the center, shorter at the edge
      const h = 1 + rand() * district.maxHeight * Math.max(0.15, 1 - rad / (26 * district.zoom));
      out.push({ p: new THREE.Vector3(dx, h / 2, dz), s: new THREE.Vector3(w, h, d), c: PALETTE[Math.floor(rand() * PALETTE.length)] });
      placed++;
    }
    return out;
  }, [district, seed]);

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

function Districts({ progress }: { progress: MotionValue<number> }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  // Shared materials so the whole avenue fades in together.
  const roadMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#101015", roughness: 0.95, transparent: true, opacity: 0, depthWrite: false }),
    []
  );
  const lineMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e9e4d8", transparent: true, opacity: 0, depthWrite: false }),
    []
  );

  useFrame(() => {
    const m = mergeAmount(progressToStop(progress.get()).u);
    DISTRICTS.forEach((d, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.position.set(
        THREE.MathUtils.lerp(d.pos[0], MERGED[i][0], m),
        0,
        THREE.MathUtils.lerp(d.pos[1], MERGED[i][1], m)
      );
    });
    roadMat.opacity = m;
    lineMat.opacity = m * 0.85;
  });

  const dashes = useMemo(() => Array.from({ length: Math.floor(AVENUE_LEN / 8) }, (_, i) => AVENUE_Z0 + 40 - i * 8), []);

  return (
    <>
      {DISTRICTS.map((d, i) => (
        <group
          key={d.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
          position={[d.pos[0], 0, d.pos[1]]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <circleGeometry args={[23 * d.zoom, 28]} />
            <meshStandardMaterial color="#23232e" roughness={1} />
          </mesh>
          <DistrictBuildings district={d} seed={i} />
          {d.landmarks.map((l) => (
            <group key={l.id} position={[l.offset[0], 0, l.offset[1]]}>
              <Landmark id={l.id} />
            </group>
          ))}
        </group>
      ))}

      {/* The avenue fades in as the districts come together */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[AVENUE_X, 0.03, AVENUE_Z0 + 40 - AVENUE_LEN / 2]} material={roadMat} receiveShadow>
        <planeGeometry args={[12, AVENUE_LEN]} />
      </mesh>
      {dashes.map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[AVENUE_X, 0.05, z]} material={lineMat}>
          <planeGeometry args={[0.35, 3.2]} />
        </mesh>
      ))}
    </>
  );
}

/* ---------------- camera rig ---------------- */

function useCameraPath() {
  return useMemo(() => {
    const positions = [
      new THREE.Vector3(CX - 35, 105, CZ + 125), // opening: the whole city from above
      ...STOPS.map(({ district: d }) => {
        const k = d.zoom * (1 + d.lookY / 18);
        return new THREE.Vector3(d.pos[0] - 15 * k, d.lookY + 8 * k, d.pos[1] + 24 * k);
      }),
      new THREE.Vector3(AVENUE_X, 11, AVENUE_Z0 + 42), // closing: front and center, down the avenue
    ];
    const targets = [
      new THREE.Vector3(CX, 0, CZ),
      ...STOPS.map(({ district: d }) => new THREE.Vector3(d.pos[0], d.lookY * 0.8, d.pos[1])),
      new THREE.Vector3(AVENUE_X, -4, AVENUE_Z0 - 140),
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
    const { t, u } = progressToStop(progress.get());
    path.pos.getPoint(t, tmpP);
    path.look.getPoint(t, tmpL);

    // Pull back a bit on narrow (portrait) screens so landmarks fit.
    const aspect = (camera as THREE.PerspectiveCamera).aspect || 1;
    if (aspect < 1) tmpP.lerp(tmpL, -(1 / aspect - 1) * 0.45 * (1 - mergeAmount(u) * 0.7));

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

    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      const open = 1 - THREE.MathUtils.smoothstep(t, 0, 0.16); // wide opening shot
      const avenue = mergeAmount(u); // long view down the avenue
      // Portrait screens sit the camera further back, so push the fog back too.
      const reach = aspect < 1 ? 1 + (1 / aspect - 1) * 0.6 : 1;
      fog.near = THREE.MathUtils.lerp(THREE.MathUtils.lerp(35, 140, open), 45, avenue) * reach;
      fog.far = THREE.MathUtils.lerp(THREE.MathUtils.lerp(130, 420, open), 300, avenue) * reach;
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CX, 0, CZ - 40]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial color="#191921" roughness={1} />
      </mesh>

      <Districts progress={progress} />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
