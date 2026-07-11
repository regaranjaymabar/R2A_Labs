import ScrollVideo from "./background/ScrollVideo";
const ThreeDMarquee = ScrollVideo as any;
import { laptops } from "../../data/laptops";
import { useNavigate } from "react-router-dom";

export default function HeroLaptopCarousel() {
  const navigate = useNavigate();

  const images = laptops.map((laptop) => ({
    id: laptop.id,
    src: laptop.image,
    alt: laptop.name,
  }));

  return (
    <section className="mt-7mb-12">
      <ThreeDMarquee
        images={images}
        cols={4}
        onImageClick={(image: any) => {
          navigate(`/product/${image.id}`);
        }}
      />
    </section>
  );
}