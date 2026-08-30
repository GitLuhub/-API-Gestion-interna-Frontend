export interface RolePublic {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}
