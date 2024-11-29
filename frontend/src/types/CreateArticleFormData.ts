interface CreateArticleFormData {
  title: string;
  content: string;
  slug: string;
  cover_url?: string | null;
  publication_date: Date | null;
} 