import { HTMLInputTypeAttribute, ReactNode } from "react";
import { InputFieldName } from "./input.type";

export interface SQLModel {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorRespone {
  statusCode: number;
  error: string | null;
  message: string | string[];
}

export interface SuccessReponse<Data> {
  data: Data;
  statusCode: number;
  message: string | string[];
}

export interface InputField {
  name: InputFieldName;

  title: string;
  placeHolder?: string;
  svgData?: ReactNode;
  type?: HTMLInputTypeAttribute | "array";
  errorMsg?: string;
  readonly?: boolean;
}
