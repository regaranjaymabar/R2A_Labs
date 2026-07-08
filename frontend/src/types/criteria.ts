export type Criteria = {
  id: number;
  code: string;
  name: string;
  type: "benefit" | "cost" | string;
}