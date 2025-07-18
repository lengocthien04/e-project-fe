import { User } from "./User/user.type";

export type AuthResponse = {
  message: string;
  access_token: string;
};

export type ProfileRespone = {
  data: User;
};
