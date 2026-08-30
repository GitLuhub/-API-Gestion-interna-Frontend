export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  roles: string[];
}
