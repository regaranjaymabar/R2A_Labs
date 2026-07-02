import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  BatteryCharging,
  Weight,
  Laptop,
  Palette,
} from "lucide-react";
import type { Laptop as LaptopType } from "../../../data/laptops.ts";

type QuickSpecsProps = {
  laptop: LaptopType;
};

export default function QuickSpecs({
  laptop,
}: QuickSpecsProps) {
  const specs = [
    {
      icon: Cpu,
      title: "Processor",
      value: laptop.cpu,
    },
    {
      icon: Monitor,
      title: "Display",
      value: laptop.display,
    },
    {
      icon: MemoryStick,
      title: "RAM",
      value: laptop.ram,
    },
    {
      icon: HardDrive,
      title: "Storage",
      value: laptop.storage,
    },
    {
      icon: Laptop,
      title: "GPU",
      value: laptop.gpu,
    },
    {
      icon: BatteryCharging,
      title: "Battery",
      value: laptop.battery,
    },
    {
      icon: Weight,
      title: "Weight",
      value: laptop.weight,
    },
    {
      icon: Palette,
      title: "Color",
      value: laptop.color,
    },
  ];

  return (
    <section className="mt-28">

      <div className="text-center">

        <h2 className="text-5xl font-bold">
          Quick Specifications
        </h2>

        <p className="text-zinc-500 mt-4">
          Spesifikasi utama yang perlu Anda ketahui.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

        {specs.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                group
                bg-white/10
                backdrop-blur-3xl
                border
                border-white/20
                rounded-[30px]
                p-6
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-black/20
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon size={26} />
              </div>

              <h3 className="mt-6 text-sm text-zinc-500">
                {item.title}
              </h3>

              <p className="mt-2 font-semibold text-lg leading-relaxed">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}