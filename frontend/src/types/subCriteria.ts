export type SubCriteria = {
  id: number;
  description: string;
  // Standar Backend API (camelCase)
  criteriaId?: number;
  valueNumeric?: number;
  createdAt?: string;
  criteria_code?: string;
  criteria_name?: string;
  criteria_type?: "benefit" | "cost" | string;

  // Alias kompatibilitas
  criteria_id?: number;
  value_numeric?: number;
  created_at?: string;
};
