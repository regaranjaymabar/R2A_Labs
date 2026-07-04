// Definisi Tipe Data Product (Sesuai kolom tabel products di MySQL)
export interface Product {
  id: number;
  brand_id: number;
  brand_name?: string; // Opsional: nama brand hasil JOIN dengan tabel brands (misal "ASUS")
  model_name: string;
  screen_size?: number; // decimal(5,2)
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: number; // int(11) dalam Wh / mAH
  weight?: number; // decimal(5,2) dalam Kg
  release_year?: number; // int(11)
  is_active: number | boolean; // tinyint(1) di MySQL: 1 = aktif, 0 = non-aktif
}
