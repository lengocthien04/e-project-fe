import { AuthResponse } from "../types/auth.type";
import { SuccessRespone } from "../types/utils.type";
import { User } from "../types/User/user.type";
import { clearLS, getAccessTokenFromLS } from "../utils/auth";
import { api } from "@/lib/api-client";

const authApi = {
  registerAccount(body: { password: string; username: string }) {
    return api.post<AuthResponse>("auth/register", body);
  },
  loginAccount(body: { username: string | null; password: string | null }) {
    return api.post<AuthResponse>("auth/login", body);
  },
  logout() {
    clearLS();
  },
  getProfile() {
    const token = getAccessTokenFromLS();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    return api.get<SuccessRespone<User>>(`auth/profile`, { headers });
  },
};

export default authApi;
