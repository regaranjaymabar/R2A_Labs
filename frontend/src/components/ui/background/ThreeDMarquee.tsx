"use client";

import { motion } from "framer-motion";

export interface MarqueeImage {
  id?: string | number;
  src: string;
  alt: string;
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number;
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export default function ThreeDMarquee({
  images,
  className = "",
  cols = 4,
  onImageClick,
}: ThreeDMarqueeProps) {
  const duplicatedImages = [...images, ...images];

  const groupSize = Math.ceil(duplicatedImages.length / cols);

  const imageGroups = Array.from({ length: cols }, (_, index) =>
    duplicatedImages.slice(index * groupSize, (index + 1) * groupSize)
  );

  return (
    <section
      className={`
        relative
        w-screen
        left-1/2
        -translate-x-1/2
        h-162.5
        overflow-hidden
        bg-transparent
        ${className}
      `}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
        }}
      >
        <div className="w-full scale-105 overflow-visible">
          <div
            className="relative grid gap-8"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            }}
          >
            {imageGroups.map((group, columnIndex) => (
              <motion.div
                key={columnIndex}
                animate={{
                  y: 0,  //columnIndex % 2 === 0 ? 120 : -120  ari pan gerak atik kode sing kie,ari pan mateni di 0 bae
                }}
                transition={{
                  duration: columnIndex % 2 === 0 ? 12 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="flex flex-col gap-8"
              >
                {group.map((image, imageIndex) => {
                  const globalIndex =
                    columnIndex * groupSize + imageIndex;

                  return (
                    <motion.div
                      key={globalIndex}
                      whileHover={{
                        y: -12,
                        scale: 1.05,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      onClick={() =>
                        onImageClick?.(image, globalIndex)
                      }
                      className="
                        cursor-pointer
                        rounded-3xl
                        p-5
                        transition-all
                      "
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="
                          w-full
                          max-w-75
                          mx-auto
                          aspect-16/10
                          object-contain
                          select-none
                          pointer-events-none
                          drop-shadow-2xl
                        "
                        draggable={false}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}