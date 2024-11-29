export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  tags?: {
    id: number;
    name: string;
  }[];
}
