// Pagination types
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}

// API Response types
export interface SuccessResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  metadata?: PaginationMetadata;
}
