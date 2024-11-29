import { useEffect } from 'react';
import './ProfileContainer.scss';
import { useLoaderData, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from 'features/authentication/contexts/AuthProvider';
import { Article } from 'types/Article';
import { Avatar } from '@mantine/core';
import { API_URL } from 'config';

const ProfileContainer = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user?.id) {
      searchParams.set('filter.authorId', user.id.toString());
      setSearchParams(searchParams, { replace: true });
    }
  }, [user?.id]);

  const { data: articles, total, current_page, last_page } = useLoaderData() as {
    data: Article[],
    total: number,
    current_page: number,
    last_page: number
  };
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'created_at,desc';

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set('sort', event.target.value);
    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  return (
    <main>
      <section className="profileHero">
        <div className="container--profileHero">
          <div className="profileHero__left">
            <h1>
              Welcome, <span>{user?.name}</span>
            </h1>
            <ul>
              <li>
                <Link to="/profile/edit">Edit profile →</Link>
              </li>
              <li>
                <Link to="">Edit subscription →</Link>
              </li>
            </ul>
          </div>
          <div className="profileHeroImage">
            <Avatar
              src={user?.avatar ? `${API_URL}/storage/${user.avatar}` : undefined}
              size={130}
              radius="100%"
              alt="Profile picture"
              className="profileHeroImage__image"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </div>
      </section>

      <section className="articlesPageList">
        <div className="container--articlesPageList">
          <Link to="/articles/create" className="button--createArticle">
            Create new post
          </Link>
          <div className="articlesListSort">
            <p>
              Showing <span>{articles.length}</span> / <span>{total}</span> articles
            </p>
            <div>
              <label htmlFor="sort">Sort by:</label>
              <select
                name="sort"
                id="sort"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="created_at,desc">Newest first</option>
                <option value="created_at,asc">Oldest first</option>
                <option value="title,asc">Title A-Z</option>
                <option value="title,desc">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="articlesList">
            {articles.map(article => (
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
                  <img
                    src={article.cover_url ? `${API_URL}/storage/${article.cover_url}` : "https://picsum.photos/500/380"}
                    alt={article.title}
                  />
                  <Link
                    to={`/articles/${article.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="edit_article"
                  >
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 12.5C25 19.404 19.404 25 12.5 25S0 19.404 0 12.5 5.596 0 12.5 0 25 5.596 25 12.5" fill="#fff" />
                      <path d="M15.197 7.773a.237.237 0 0 0-.337 0l-.996.997a.24.24 0 0 0 0 .336l1.698 1.699a.236.236 0 0 0 .337 0l.996-.996a.24.24 0 0 0 0-.337zm3.307-.485L17.38 6.165a.24.24 0 0 0-.169-.07.24.24 0 0 0-.168.07l-.678.678a.24.24 0 0 0-.07.168c0 .064.025.124.07.169l1.123 1.123a.237.237 0 0 0 .337 0l.678-.678a.24.24 0 0 0 0-.337m-5.612 2.811a.24.24 0 0 0-.168-.07.24.24 0 0 0-.168.07l-6.618 6.617a.24.24 0 0 0 0 .337l.32.32-.527 1.393c-.028.074-.013.119.004.143q.032.045.093.045a.2.2 0 0 0 .075-.015l1.394-.527.32.32a.24.24 0 0 0 .168.069.24.24 0 0 0 .168-.07l6.617-6.617a.24.24 0 0 0 0-.337z" fill="#2CBCFF" />
                    </svg>
                  </Link>
                </div>
                <div className="articleCard__body">
                  <div className="tag--articleCard">Design</div>
                  <div className="cardContent cardContent--articleCard">
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

          {last_page > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {last_page}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === last_page}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProfileContainer;
