export interface DecodedToken {
  exp?: number; // Expiration time
  sub?: string;
  email?: string;
  app?: string;
  baseUrl?: string;
}
