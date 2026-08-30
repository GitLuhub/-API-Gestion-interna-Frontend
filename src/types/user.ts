export interface UserPublic {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}
