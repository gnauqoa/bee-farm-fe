import { AuthActionResponse, AuthProvider, CheckResponse } from "@refinedev/core";
import { axiosInstance } from "@refinedev/nestjsx-crud";

export const API_URL = "http://localhost:3000/api/v1";

export const authProvider: AuthProvider = {
  login: async (): Promise<AuthActionResponse> => {
    // ...
    // We're setting the Authorization header when the user logs in.
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
    return {
      success: true,
      redirectTo: "/",
    };
  },
  logout: async (): Promise<AuthActionResponse> => {
    // ...
    // We're removing the Authorization header when the user logs out.
    axiosInstance.defaults.headers.common["Authorization"] = undefined;
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (): Promise<CheckResponse> => {
    // Implement your check logic here
    return {
      authenticated: !!localStorage.getItem("token"),
    };
  },
  onError: async (error: any): Promise<AuthActionResponse> => {
    // Implement your error handling logic here
    console.error(error);
    return {
      success: false,
    };
  },
};
