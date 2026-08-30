export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
}

export interface StandardResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}
