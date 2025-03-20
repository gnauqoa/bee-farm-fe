export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? "token";
export const REFRESH_TOKEN_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_KEY ?? "refresh-token";
export const TOKEN_EXPIRES_AT_KEY =
  import.meta.env.VITE_TOKEN_EXPIRES_AT_KEY ?? "token-expires";
export const USER_DATA_KEY = import.meta.env.USER_DATA_KEY ?? "user-data";
export const TIME_THRESHOLD =
  import.meta.env.VITE_TIME_THRESHOLD ?? 60 * 60 * 1000;
