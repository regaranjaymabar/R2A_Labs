import { useEffect, useRef, useState } from "react";
import videoSrc from "../../../assets/macbookneo.webm";

const VIDEO_START = 0;
const VIDEO_END = 6;

export default function ScrollVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideoReady = useRef(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    const range = VIDEO_END - VIDEO_START;

    const handleReady = () => {
      isVideoReady.current = true;
      video.pause();
      video.currentTime = VIDEO_START;
      setProgress(0);
    };

    if (video.readyState >= 1) {
      handleReady();
    } else {
      video.addEventListener("loadedmetadata", handleReady);
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isVideoReady.current) return;

      const rect = section.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const currentProgress =
        (video.currentTime - VIDEO_START) / range;

      if (currentProgress >= 1 && e.deltaY > 0) return;
      if (currentProgress <= 0 && e.deltaY < 0) return;

      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.005 : -0.005;

      const newProgress = Math.min(
        Math.max(currentProgress + delta, 0),
        1
      );

      video.currentTime = VIDEO_START + newProgress * range;
      setProgress(newProgress);
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVideoReady.current) return;

      const rect = section.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const currentProgress =
        (video.currentTime - VIDEO_START) / range;

      const deltaY = touchStartY - e.touches[0].clientY;

      if (currentProgress >= 1 && deltaY > 0) return;
      if (currentProgress <= 0 && deltaY < 0) return;

      e.preventDefault();

      const delta = deltaY > 0 ? 0.02 : -0.02;

      const newProgress = Math.min(
        Math.max(currentProgress + delta, 0),
        1
      );

      video.currentTime = VIDEO_START + newProgress * range;
      setProgress(newProgress);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      video.removeEventListener("loadedmetadata", handleReady);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden mb-10"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-1.5  rounded-full overflow-hidden">
        <div
          className="h-full bg-black/60 rounded-full transition-all duration-75"
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </section>
  );
}