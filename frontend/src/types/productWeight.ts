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

export type ProductWeight = ProductCriteria;

export type ProductWeightFormData = {
  product_id: number;
  criteria_id: number;
  sub_criteria_id: number;
  value_numeric: number;
};

