export type SubCriteria = {
  id: number;
  criteria_id: number;
  description: string; 
  value_numeric: number; 
  created_at?: string;
  criteria_code?: string; 
  criteria_name?: string;  
  criteria_type?: "benefit" | "cost" | string; 
};
