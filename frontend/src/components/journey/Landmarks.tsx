// frontend/src/components/journey/Landmarks.tsx
// Procedural low-poly landmarks (no external models → tiny download, one consistent style).
"use client";

import * as THREE from "three";
import type { LandmarkId } from "./cities";

type V3 = [number, number, number];

const C = {
  concrete: "#c9c4bb",
  white: "#ece8df",
  gold: "#e0b04a",
  red: "#c4432f",
  glass: "#6f93b8",
  green: "#3f6b45",
  dark: "#3a3a44",
  water: "#1f3c5c",
};

function Mat({ color, emissive }: { color: string; emissive?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      roughness={0.8}
      metalness={0.05}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissive ? 0.6 : 0}
    />
  );
}

function Box({ p, s, color, r = [0, 0, 0] as V3 }: { p: V3; s: V3; color: string; r?: V3 }) {
  return (
    <mesh position={p} rotation={r} castShadow receiveShadow>
      <boxGeometry args={s} />
      <Mat color={color} />
    </mesh>
  );
}

function Cyl({ p, rt, rb, h, color, seg = 10 }: { p: V3; rt: number; rb: number; h: number; color: string; seg?: number }) {
  return (
    <mesh position={p} castShadow>
      <cylinderGeometry args={[rt, rb, h, seg]} />
      <Mat color={color} />
    </mesh>
  );
}

function Cone({ p, r, h, color, seg = 10 }: { p: V3; r: number; h: number; color: string; seg?: number }) {
  return (
    <mesh position={p} castShadow>
      <coneGeometry args={[r, h, seg]} />
      <Mat color={color} />
    </mesh>
  );
}

/* ---------- Toronto: CN Tower ---------- */
function CNTower() {
  return (
    <group>
      <Cyl p={[0, 10, 0]} rt={0.45} rb={1.4} h={20} color={C.concrete} seg={3} />
      <Cyl p={[0, 20.8, 0]} rt={1.9} rb={1.6} h={1.6} color={C.dark} seg={14} />
      <Cyl p={[0, 21.9, 0]} rt={1.3} rb={1.9} h={0.6} color={C.concrete} seg={14} />
      <Cyl p={[0, 25.5, 0]} rt={0.28} rb={0.4} h={6.5} color={C.concrete} seg={8} />
      <Cyl p={[0, 28.9, 0]} rt={0.6} rb={0.6} h={0.5} color={C.dark} seg={10} />
      <Cyl p={[0, 33, 0]} rt={0.05} rb={0.18} h={8} color={C.red} seg={6} />
    </group>
  );
}

/* ---------- Seoul: N Seoul Tower on Namsan ---------- */
function NSeoulTower() {
  return (
    <group>
      <Cone p={[0, 3.5, 0]} r={11} h={7} color={C.green} seg={9} />
      <Cyl p={[0, 11, 0]} rt={0.35} rb={0.55} h={8} color={C.white} seg={8} />
      <Cyl p={[0, 15.6, 0]} rt={1.3} rb={1.1} h={1.6} color={C.dark} seg={12} />
      <Cyl p={[0, 16.8, 0]} rt={0.9} rb={1.3} h={0.8} color={C.white} seg={12} />
      <Cyl p={[0, 20.5, 0]} rt={0.05} rb={0.25} h={6.5} color={C.red} seg={6} />
    </group>
  );
}

/* ---------- Mexico City: Ángel de la Independencia ---------- */
function Angel() {
  return (
    <group>
      <Box p={[0, 0.6, 0]} s={[6, 1.2, 6]} color={C.concrete} />
      <Box p={[0, 1.8, 0]} s={[4, 1.2, 4]} color={C.white} />
      <Cyl p={[0, 9.4, 0]} rt={0.5} rb={0.65} h={14} color={C.white} seg={12} />
      <Cyl p={[0, 16.7, 0]} rt={0.9} rb={0.6} h={0.6} color={C.gold} seg={10} />
      <Cone p={[0, 17.9, 0]} r={0.35} h={1.8} color={C.gold} seg={8} />
      <Box p={[-0.7, 18.3, 0]} s={[1.3, 0.12, 0.5]} r={[0, 0, 0.5]} color={C.gold} />
      <Box p={[0.7, 18.3, 0]} s={[1.3, 0.12, 0.5]} r={[0, 0, -0.5]} color={C.gold} />
    </group>
  );
}

/* ---------- Thailand: Wat Arun-style prang ---------- */
function Prang({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <Box p={[0, 0.6, 0]} s={[5, 1.2, 5]} color={C.white} />
      <Box p={[0, 1.7, 0]} s={[3.8, 1, 3.8]} color={C.white} />
      <Cyl p={[0, 3.6, 0]} rt={1.3} rb={1.7} h={2.8} color={C.white} seg={8} />
      <Cyl p={[0, 6.2, 0]} rt={0.95} rb={1.3} h={2.4} color={C.gold} seg={8} />
      <Cyl p={[0, 8.4, 0]} rt={0.6} rb={0.95} h={2} color={C.white} seg={8} />
      <Cone p={[0, 10.6, 0]} r={0.6} h={2.6} color={C.gold} seg={8} />
      <Cyl p={[0, 12.6, 0]} rt={0.03} rb={0.1} h={1.6} color={C.gold} seg={5} />
    </group>
  );
}
function WatArun() {
  return (
    <group>
      <Prang scale={1.25} />
      {[
        [-6, -6],
        [6, -6],
        [-6, 6],
        [6, 6],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <Prang scale={0.55} />
        </group>
      ))}
    </group>
  );
}

/* ---------- São Paulo: Ponte Estaiada ---------- */
function PonteEstaiada() {
  const top: V3 = [0, 15, 0];
  const anchors: V3[] = [-12, -8, -4, 4, 8, 12].map((x) => [x, 2.3, 0]);
  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 7]} />
        <meshStandardMaterial color={C.water} roughness={0.4} />
      </mesh>
      <Box p={[0, 2, 0]} s={[30, 0.45, 2.2]} color={C.concrete} />
      <Box p={[0, 7.5, 0]} s={[0.8, 15.5, 0.8]} r={[0.35, 0, 0]} color={C.white} />
      <Box p={[0, 7.5, 0]} s={[0.8, 15.5, 0.8]} r={[-0.35, 0, 0]} color={C.white} />
      {anchors.map((a, i) => {
        const start = new THREE.Vector3(...top);
        const end = new THREE.Vector3(...a);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const len = start.distanceTo(end);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
        return (
          <mesh key={i} position={mid} quaternion={q}>
            <cylinderGeometry args={[0.05, 0.05, len, 4]} />
            <Mat color={C.gold} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Panama City: F&F "screw" tower ---------- */
function ScrewTower() {
  const floors = 26;
  return (
    <group>
      {Array.from({ length: floors }).map((_, i) => (
        <Box key={i} p={[0, 0.5 + i * 0.95, 0]} s={[3.6, 0.85, 3.6]} r={[0, (i * Math.PI) / 2 / 9, 0]} color={C.glass} />
      ))}
      <Box p={[-7, 9, 3]} s={[3, 18, 3]} color={C.glass} />
      <Box p={[6, 7.5, -4]} s={[3.4, 15, 3.4]} color={C.concrete} />
    </group>
  );
}

export function Landmark({ id }: { id: LandmarkId }) {
  switch (id) {
    case "toronto":
      return <CNTower />;
    case "seoul":
      return <NSeoulTower />;
    case "cdmx":
      return <Angel />;
    case "thailand":
      return <WatArun />;
    case "saopaulo":
      return <PonteEstaiada />;
    case "panama":
      return <ScrewTower />;
  }
}
