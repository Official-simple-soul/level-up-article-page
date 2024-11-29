import {
  IsAuthorizedRequestStatus,
  useAuth
} from 'features/authentication/contexts/AuthProvider';
import { useLoaderData, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Article } from 'types/Article';
import { getTags } from '../utils/articles';
import { API_URL } from 'config';

const Root = () => {
  const { isAuthorized } = useAuth();
  const { data: articles } = useLoaderData() as { data: Article[] };
  const [searchParams, setSearchParams] = useSearchParams();

  // Add tags query
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
  });

  const currentTag = searchParams.get('tag') || 'all';

  const featuredArticles = articles.filter(article => {
    return article.tags?.some(tag => tag.name.toLowerCase() === 'featured')
  }
  ).slice(0, 3);

  const filteredArticles = currentTag === 'all'
    ? articles
    : articles.filter(article =>
      article.tags?.some(tag => tag.name === currentTag)
    );

  const latestArticles = filteredArticles.slice(0, 4);

  const handleTagClick = (tagName: string) => {
    if (tagName === 'all') {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tagName);
    }
    setSearchParams(searchParams);
  };

  console.log(tagsData, 'tagsData');

  return (
    <>
      <main>
        <section className="hero">
          <article className="container--hero">
            <h1>
              Lorem ipsum dolor <span>sit amet</span>
            </h1>
            <div className="divider" />
            <p>
              Donec non massa auctor, dictum ante eu, ultrices eros. Sed sit
              amet augue nec diam tempor placerat. Integer dignissim lacinia
              turpis.
            </p>
          </article>
        </section>
        <section className="featuredNews">
          <div className="container--featuredNews">
            <div className="featuredNews__heading">
              <h2>Featured news</h2>
              <Link to="/articles?tag=featured">All featured news</Link>
            </div>
            <div className="featuredCardsList">
              {featuredArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="featuredCard"
                >
                  {article.premium && (
                    <div className="premiumFlag--articleCard">
                      <img
                        src="/assets/images/premium-icon.svg"
                        alt="Premium Article"
                        className="premium-icon"
                      />
                    </div>
                  )}
                  <img
                    className="featuredCard__image"
                    src={`${API_URL}/storage/${article.cover_url}`}
                    alt={article.title}
                  />
                  <div className="featuredCard__overlay" />
                  <div className="featuredCard__content">
                    <div className="tag--featuredCard">Article</div>
                    <div className="cardContent--featuredCard">
                      <p className="cardContent__date">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                      <h3 className="cardContent__title">{article.title}</h3>
                      <p className="cardContent__author">By: {article?.author?.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="latestNews">
          <div className="container--latestNews">
            <div className="latestNews__header">
              <div className="latestNews__heading">
                <h3>Latest news</h3>
                <div className="divider--latestNews" />
                <p>
                  Donec non massa auctor, dictum ante eu, ultrices eros. Sed sit
                  amet augue nec diam tempor placerat.
                </p>
              </div>
              <nav>
                <ul className="listTabs">
                  <li
                    className={`tag--tab ${currentTag === 'all' ? 'tag--tabActive' : ''}`}
                    onClick={() => handleTagClick('all')}
                  >
                    All
                  </li>
                  {tagsData?.map(tag => (
                    <li
                      key={tag.id}
                      className={`tag--tab ${currentTag === tag.name ? 'tag--tabActive' : ''}`}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="articlesList">
              {latestArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="articleCard"
                >
                  {article.premium && (
                    <div className="premiumFlag--articleCard">
                      <img
                        src="/assets/images/premium-icon.svg"
                        alt="Premium Article"
                        className="premium-icon"
                      />
                    </div>
                  )}
                  <div className="articleCard__imgBox">
                    <img src={`${API_URL}/storage/${article.cover_url}`} alt={article.title} />
                  </div>
                  <div className="articleCard__body">
                    <div className="tag--articleCard">
                      {article.tags?.map(tag => tag.name).join(', ')}
                    </div>
                    <div className="cardContent cardContent--articleCard">
                      <p className="cardContent__date">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                      <h3 className="cardContent__title">{article.title}</h3>
                      <p className="cardContent__author">By: {article.author?.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="latestNews__link">
              <Link to="/articles" className="button--latestNews">
                News page
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="modal">
        <div className="modal__container">
          <div className="modal__heading">
            <h4>Modal text</h4>
            <div className="modal__close">
              <img
                src="/src/assets/images/close-modal-icon.svg"
                alt="Menu icon"
              />
            </div>
          </div>
          <div className="modal__content">
            <form action="" className="form--simple">
              <div className="inputBox">
                <label htmlFor="">Label</label>
                <input type="text" placeholder="Placeholder" />
                <p>Error</p>
              </div>
              <div className="inputBox">
                <label htmlFor="">Label</label>
                <input type="text" placeholder="Placeholder" />
                <p>Error</p>
              </div>
              <div className="inputBox">
                <label htmlFor="">Label</label>
                <input type="text" placeholder="Placeholder" />
                <p>Error</p>
              </div>
              <div className="inputBox">
                <label htmlFor="">Label</label>
                <input type="text" placeholder="Placeholder" />
                <p>Error</p>
              </div>
              <div className="form__buttonBox">
                <button className="button">Action</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;
