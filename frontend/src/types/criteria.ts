export interface CriteriaSubCriteria {
  id: number;
  criteriaId: number;
  description: string;
  valueNumeric: number;
}

export type Criteria = {
  id: number;
  code: string;
  name: string;
  type: "benefit" | "cost" | string;
  createdAt?: string;
  subCriteria?: CriteriaSubCriteria[];
  weight?: number;
};