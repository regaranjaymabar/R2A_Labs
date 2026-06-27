import Silk from "./silk";

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-20">
      <Silk
        speed={3}
        scale={1.3}
        color="#E5E5E5"
        noiseIntensity={1}
        rotation={0}
      />
    </div>
  );
}