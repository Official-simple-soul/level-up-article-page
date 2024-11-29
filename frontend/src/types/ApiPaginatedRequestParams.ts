interface ApiPaginatedRequestParams {
  page?: number;
  perPage?: number;
  sort?: Record<string, 'asc' | 'desc'>;
}

export default ApiPaginatedRequestParams;
