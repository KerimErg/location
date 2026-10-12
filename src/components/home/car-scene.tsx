"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const CAR_MODEL_URL = "/models/car.glb";

function Car({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useGLTF(CAR_MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // Centre le modèle et le pose au sol, quelle que soit sa taille d'origine.
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const scale = 4.6 / Math.max(size.x, size.z);
    clone.scale.setScalar(scale);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = box2.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -box2.min.y, -center.z);
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && "envMapIntensity" in m) m.envMapIntensity = 1.4;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => onLoaded(), [onLoaded]);

  // Entrée douce : la voiture glisse depuis le bas
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, 0, 3, dt);
  });

  return (
    <group ref={ref} position={[0, -0.6, 0]}>
      <primitive object={model} />
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[400, 120]}
        resolution={1024}
        mixBlur={1}
        mixStrength={18}
        roughness={0.85}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0d0d0e"
        metalness={0.6}
        mirror={0.5}
      />
    </mesh>
  );
}

function Studio() {
  // Éclairage studio procédural : aucune ressource HDR externe n'est téléchargée.
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
      <Lightformer form="rect" intensity={2} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={2} position={[6, 2, -2]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      <Lightformer form="ring" color="#ff5f00" intensity={2.2} position={[4, 3, -6]} scale={3} />
      <Lightformer form="rect" intensity={1} position={[0, 1, 8]} scale={[10, 1, 1]} />
    </Environment>
  );
}

export default function CarScene({ onLoaded }: { onLoaded: () => void }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [6.2, 1.9, 6.4], fov: 30 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color("#0a0a0a"), 0)}
    >
      <fog attach="fog" args={["#0a0a0a", 12, 26]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 9, 4]} angle={0.4} penumbra={1} intensity={120} castShadow shadow-mapSize={[2048, 2048]} />
      <Suspense fallback={null}>
        <Car onLoaded={onLoaded} />
        <Studio />
      </Suspense>
      <ContactShadows position={[0, 0.001, 0]} opacity={0.75} scale={12} blur={2.4} far={3} />
      <Floor />
      <OrbitControls
        makeDefault
        target={[0, 0.7, 0]}
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        enableDamping
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}

useGLTF.preload(CAR_MODEL_URL);
