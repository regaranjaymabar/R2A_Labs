import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CityOption {
  value: string;
  label: string;
}

// Fallback daftar kota lengkap di Indonesia jika offline / jaringan gangguan
const FALLBACK_CITIES: CityOption[] = [
].map((city) => ({ value: city, label: city }));

// Fungsi helper untuk mengubah nama kota dari UPPERCASE menjadi Title Case rapi
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function useIndonesianCities() {
  return useQuery<CityOption[]>({
    queryKey: ["indonesian-cities"],
    queryFn: async () => {
      try {
        // 1. Ambil daftar provinsi dari API Wilayah Indonesia Emsifa
        const provincesRes = await axios.get(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
          { timeout: 5000 }
        );
        const provinces: { id: string; name: string }[] = provincesRes.data;

        // 2. Ambil daftar kota dari provinsi yang dipilih
        const regenciesPromises = provinces.map((prov) =>
          axios
            .get(
              `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`,
              { timeout: 5000 }
            )
            .then((res) => res.data)
            .catch(() => [])
        );

        const allRegenciesArrays = await Promise.all(regenciesPromises);
              const flatRegencies: { id: string; province_id: string; name: string }[] =
          allRegenciesArrays.flat();

        if (flatRegencies.length === 0) {
          return FALLBACK_CITIES;
        }

        // 3. Ubah format menjadi { value, label }
        const formattedCities: CityOption[] = flatRegencies
          .map((item) => {
            const cleanName = toTitleCase(item.name);
            return {
              value: cleanName,
              label: cleanName,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        return formattedCities;
      } catch (error) {
        console.warn(
          "Gagal mengambil data kota dari API Wilayah Emsifa, menggunakan data kota offline fallback.",
          error
        );
        return FALLBACK_CITIES;
      }
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
