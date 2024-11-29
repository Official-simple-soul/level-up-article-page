interface LinkData {
  url: string | null;
  label: string;
  active: boolean;
}

interface ApiPaginatedResponse<Tdata> {
  current_page: number;
  data: Tdata[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LinkData[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export default ApiPaginatedResponse;
