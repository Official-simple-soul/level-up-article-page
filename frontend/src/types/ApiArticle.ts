interface ApiArticle {
  id: number;
  title: string;
  content: string;
  cover?: File | null;
}

export default ApiArticle;
