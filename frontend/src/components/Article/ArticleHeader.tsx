import { Link } from 'react-router-dom';

interface ArticleHeaderProps {
  category: string;
  date: string;
}

const ArticleHeader = ({ category, date }: ArticleHeaderProps) => {
  return (
    <div className="article__header">
      <div className="tag--articleCard">Design</div>
      <Link to="/articles" className="article__back-link">
        &lt;- Back to blog
      </Link>
      <span className="article__date">{date}</span>
    </div>
  );
};

export default ArticleHeader;
