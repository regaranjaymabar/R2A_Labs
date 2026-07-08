/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  images: string[];
};

export default function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div className="w-full">

      {/* Main Image */}
      <div
        className="
            h-97.5
            lg:h-105
            flex
            items-center
            justify-center
            px-6
        "
      >
        <img
          src={selectedImage}
          alt="Laptop"
          className="
            max-h-full
            max-w-full
            object-contain
            transition-all
            duration-500
            hover:scale-105
          "
        />
      </div>

      {/* Thumbnail */}
      <div
        className="
          mt-2
          flex
          justify-center
          gap-3
          flex-wrap
        "
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`
              w-18
              h-18
              rounded-xl
              overflow-hidden
              transition-all
              duration-300
              border
              

              ${
                selectedImage === image
                  ? "border-black scale-105"
                  : "border-black/10 hover:border-black/40"
              }
            `}
          >
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

    </div>
  );
}