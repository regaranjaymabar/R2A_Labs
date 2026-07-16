export interface Brand {
  id: number;
  name: string;
  
}

export interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  isActive: number;
  distanceInKm: number | null;
}

export interface ProductStore {
  id: number;
  productId: number;
  storeId: number;
  price: number;
  stock: number;
  isAvailable: number;
  distanceInKm: number | null;
  store: Store;
}

export interface SubCriteria {
  id: number;
  criteriaId: number;
  description: string;
  valueNumeric: number;
  criteria: {
    id: number;
    code: string;
    name: string;
    type: string;
  };
}

export interface ProductCriteria {
  id: number;
  productId: number;
  subCriteriaId: number;
  subCriteria: SubCriteria;
}

export interface Product {
  id: number;
  brandId: number;
  modelName: string;
  screenSize: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  weight: string;
  releaseYear: string;
  brand: Brand;
  imageUrl: string | null;
  productCriteria: ProductCriteria[];
  productStores: ProductStore[];
}

export interface CatalogResponse {
  success: boolean;
  data: Product[];
}

// Type untuk detail (sama dengan Product, bisa extend)
export type ProductDetail = Product;