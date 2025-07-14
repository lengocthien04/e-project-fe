export interface ErrorRespone {
  message: string;
  error_key: string;
  status_code: number;
  log: string;
}

export interface SuccessRespone<Data> {
  data: Data;
  message: string;
}
