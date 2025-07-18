import { SQLModel } from "../common.type";

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}
export interface User {
  username: string;
  role: string;
}

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface UserModel extends UserCreate, SQLModel {}
