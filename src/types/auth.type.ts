import { User } from "./User/user.type";

export type AuthResponse = {
  message: string;
  token: string;
};

export type ProfileRespone = {
  data: User;
};
