import { LoaderFunctionArgs } from 'react-router-dom';
import { getArticles, getArticle } from 'utils/articles';

export async function articlesLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') || 'created_at,DESC';
  const [field, direction] = sortParam.split(',');

  const tagParam = url.searchParams.get('tag');
  const searchParam = url.searchParams.get('search');
  const articles = await getArticles({
    page: 1,
    perPage: 10,
    sort: [`${field},${direction}`],
    ...(tagParam && { tag: tagParam }),
    ...(searchParam && { search: searchParam })
  });

  return articles;
}

export async function articleLoader({ params }: LoaderFunctionArgs) {
  if (!params.articleId) throw new Error('Article ID is required');
  const article = await getArticle(parseInt(params.articleId));
  return article;
}
