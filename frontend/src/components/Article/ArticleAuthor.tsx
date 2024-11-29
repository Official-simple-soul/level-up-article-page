interface ArticleAuthorProps {
  name: string;
  avatar: string;
}

const ArticleAuthor = ({ name, avatar }: ArticleAuthorProps) => {
  return (
    <div className="article__author">
      <p className="article__author-label">Article author:</p>
      <div className="article__author-info">
        <img
          src="/src/assets/images/Jane_joe-min.png"
          alt={name}
          className="article__author-avatar"
        />
        <p className="article__author-name">{name}</p>
      </div>
    </div>
  );
};

export default ArticleAuthor;
