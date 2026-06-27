import { Outlet } from "react-router-dom";
import Header from "../Header";
import BackgroundEffect from "../ui/background/BackgroundEffect";



export default function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <BackgroundEffect />

      {/* Overlay putih transparan */}
      <div
        className="
        fixed
        inset-0
        bg-white/40
        backdrop-blur-[2px]
        -z-10
      "
      />

      <Header search={""} setSearch={function (): void {
        throw new Error("Function not implemented.");
      } } />

      <Outlet />
    </div>
  );
}