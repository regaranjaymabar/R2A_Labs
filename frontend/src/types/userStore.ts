export type UserStoreAccess = {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  store_id: number;
  store_name: string;
  store_city: string;
  is_active: boolean;
  assigned_at: string;
};

export type UserStoreFormData = {
  userId: number;
  storeId: number;
  [key: string]: any;
};
