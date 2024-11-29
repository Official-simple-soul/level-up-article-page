const ArticleSocial = () => {
  return (
    <div className="article__social">
      <p className="article__social-title">Share on social media:</p>
      <div className="article__social-links">
        <a href="#" className="social-link">
          <img src="/src/assets/images/facebook-logo.svg" alt="Facebook" />
        </a>
        <a href="#" className="social-link">
          <img src="/src/assets/images/twitter-logo.svg" alt="Twitter" />
        </a>
        <a href="#" className="social-link">
          <img src="/src/assets/images/pinterest-logo.svg" alt="Pinterest" />
        </a>
        <a href="#" className="social-link">
          <img src="/src/assets/images/behance-logo.svg" alt="behance" />
        </a>
      </div>
    </div>
  );
};

export default ArticleSocial;
