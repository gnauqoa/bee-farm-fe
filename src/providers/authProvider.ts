import {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
} from "@refinedev/core";
import { axiosInstance } from "@refinedev/nestjsx-crud";
import {} from "constants";
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  TOKEN_EXPIRES_AT_KEY,
  API_URL,
} from "../constants";
import { extractRoleInfoFromToken } from "../utility/user";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/auth/email/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(TOKEN_EXPIRES_AT_KEY, data.tokenExpires);

        const userRoleId = extractRoleInfoFromToken(data.token);
        const resourcePathToRedirect =
          userRoleId?.id === 1 ? "/users" : "/users";

        return {
          success: true,
          redirectTo: resourcePathToRedirect,
        };
      } else {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Invalid username or password",
          },
        };
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login.",
        },
      };
    }
  },
  logout: async (): Promise<AuthActionResponse> => {
    // ...
    localStorage.removeItem(TOKEN_KEY);
    axiosInstance.defaults.headers.common["Authorization"] = undefined;
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (): Promise<CheckResponse> => {
    // Implement your check logic here
    return {
      authenticated: !!localStorage.getItem(TOKEN_KEY),
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
