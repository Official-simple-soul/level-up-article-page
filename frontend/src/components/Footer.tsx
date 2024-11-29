const Footer = () => {
  return (
    <footer className="footer">
      <article className="container--footer">
        <h3>Follow us on social media</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <a href="#">
              <img src="/src/assets/images/facebook-logo.svg" alt="Facebook logo" />
            </a>
          </li>
          <li className="footer__item">
            <a href="#">
              <img src="/src/assets/images/twitter-logo.svg" alt="Twitter logo" />
            </a>
          </li>
          <li className="footer__item">
            <a href="#">
              <img src="/src/assets/images/pinterest-logo.svg" alt="Pinterest logo" />
            </a>
          </li>
          <li className="footer__item">
            <a href="#">
              <img src="/src/assets/images/behance-logo.svg" alt="Behance logo" />
            </a>
          </li>
        </ul>
      </article>
    </footer>
  );
};

export default Footer;
