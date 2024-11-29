import ArticleHeader from './ArticleHeader';
import ArticleBanner from './ArticleBanner';
import ArticleAuthor from './ArticleAuthor';
import ArticleSocial from './ArticleSocial';
import type { Article } from 'features/articles/api';

interface ArticleSectionProps {
  article: Article;
}

export const ArticleSection = ({ article }: ArticleSectionProps) => {
  return (
    <article className="article">
      <ArticleBanner />
      <div className="article__container">
        <div>
          <ArticleHeader
            category={article.category}
            date={new Date(article.created_at).toLocaleDateString()}
          />

          <h1 className="article__title">{article.title}</h1>

          <div className="article__content">
            {article.content}
          </div>
        </div>
        <div>
          <ArticleAuthor
            name={article?.author?.name}
            avatar={article.author.avatar}
          />
          <div className="article__related">
            <h2 className="article__related-title">Posted by author:</h2>
            <a href="#" className="article__related-item">
              <h3 className="article__related-item-title">Name of related article</h3>
              <p className="article__related-item-subtitle">Another article by author</p>
            </a>
          </div>
          <ArticleSocial />
        </div>
      </div>
    </article>
  );
};
