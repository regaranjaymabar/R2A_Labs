export type ProductStore = {
  id: number;
  product_id: number;
  store_id: number;
  price: number;
  stock: number;
  is_available: boolean | number;
  updated_at?: string;
  product_name?: string;
  brand_name?: string;
  store_name?: string;
};

export type ProductStoreFormData = {
  productId: number;
  storeId?: number;
  price: number;
  stock: number;
  isAvailable?: boolean;
  [key: string]: any;
};
