import { SQLModel } from "../common.type";

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}
export interface User {
  email: string;
  username: string;
}

export interface UserLoginDto {
  email: string | null;
  password: string | null;
}

export interface UserModel extends UserCreate, SQLModel {}
