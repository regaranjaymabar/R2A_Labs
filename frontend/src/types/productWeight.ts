export type ProductCriteria = {
  id: number;
  product_id: number;
  criteria_id: number;
  sub_criteria_id: number;
  sub_criteria_description: string;
  value_numeric: number;
  created_at?: string;
  product_name?: string;
  criteria_code?: string;
  criteria_name?: string;
};

export type ProductWeightFormData = {
  productId: number;
  subCriteriaMap: Record<number, number>;
  [key: string]: any;
};
export type ProductWeight = ProductCriteria;
