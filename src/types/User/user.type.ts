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
  username: string;
  password: string;
}

export interface UserModel extends UserCreate, SQLModel {}
