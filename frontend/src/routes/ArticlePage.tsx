import { useLoaderData } from 'react-router-dom';
import type { Article } from 'types/Article';
import { ArticleSection } from 'components/Article/ArticleSection';
import { CommentsSection } from 'components/Comments/CommentsSection';

const ArticlePage = () => {
  const article = useLoaderData() as Article;

  return (
    <>
      <ArticleSection article={article} />
      <CommentsSection articleId={article.id} />
    </>
  );
};

export default ArticlePage;
