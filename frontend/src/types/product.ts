
export type Product = {
  id: number;
  brand_id: number;
  brand_name?: string; 
  model_name: string;
  screen_size?: number;   
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: number; 
  weight?: number; 
  release_year?: number;  
  is_active: number | boolean; 
}
