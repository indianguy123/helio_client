import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";

function ParticleField() {
  const ref = useRef();
  const points = useMemo(() => {
    const values = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 12;
      values[i * 3 + 1] = (Math.random() - 0.5) * 8;
      values[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled>
      <PointMaterial transparent color="#60a5fa" size={0.045} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function AuthScene() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 4]} intensity={0.5} color="#93c5fd" />
        <ParticleField />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.1} />
      </Canvas>
    </div>
  );
}
