// API

export type APIError = {
  errorCode: number;
  message: string;
};

export interface NotPaginatedAPIResponse<Results> {
  results: Results;
}

export interface PaginatedAPIResponse<Results> {
  pageNumber: number | null;
  totalPpages: number;
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
  firstPage: string | null;
  lastPage: string | null;
  results: Results;
}

export interface APIResponse<Results> {
  error: APIError | null;
  isLoading: boolean;
  response: Results | null;
}

export type PaginationParams = {
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
};
