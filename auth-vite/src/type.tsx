export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface UserSession {
  user: User;
}