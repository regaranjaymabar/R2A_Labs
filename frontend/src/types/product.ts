export type Product = {
  id: number;
  // Standar Backend API (camelCase sesuai dokumen_api.md & Prisma ORM)
  brandId?: number;
  modelName?: string;
  screenSize?: number | string;
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: string | number;
  weight?: string | number;
  releaseYear?: string | number;
  isActive?: number | boolean;
  imageUrl?: string | null;
  brand?: {
    id: number;
    name: string;
  };

  // Alias kompatibilitas (mendukung kode lama yang masih memanggil snake_case)
  brand_id?: number;
  brand_name?: string;
  model_name?: string;
  screen_size?: number;
  release_year?: string | number;
  is_active?: number | boolean;
};

export type ProductFormData = {
  brandId: number;
  modelName: string;
  screenSize?: number;
  processor: string;
  ram: string;
  storage: string;
  battery?: string;
  weight: number;
  releaseYear: string;
  subCriteriaIds?: number[];
  is_active?: boolean;
  image?: File | null;
  removeImage?: boolean;
  [key: string]: any;
};
