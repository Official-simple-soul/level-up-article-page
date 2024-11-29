import { useLoaderData, Link, useSearchParams } from 'react-router-dom';
import type { Article } from 'types/Article';
import './style.scss';
import { API_URL } from 'config';
import { useQuery } from '@tanstack/react-query';
import { getTags } from '../../utils/articles';
import { useState, useEffect } from 'react';

const ArticlesContainer = () => {
  const articles = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(articles, 'articlesarticlesarticles')
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', e.target.value);
      return newParams;
    });
  };

  const currentSort = searchParams.get('sort') || 'created_at,DESC';

  const initialTag = searchParams.get('tag') || 'all';
  const [currentTag, setCurrentTag] = useState(initialTag);

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  const handleTagClick = (tagName: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (tagName === 'all') {
        newParams.delete('tag');
      } else {
        newParams.set('tag', tagName);
      }
      return newParams;
    });
    setCurrentTag(tagName);
  };

  return (
    <main>
      <section className="articlesHero">
        <div className="container--articlesHero">
          <h1>Articles</h1>
        </div>
      </section>

      <section className="articlesPageList">
        <div className="container--articlesPageList">
          <div className="articlesListHeading">
            <form action="" className="searchArticlesForm">
              <input type="text" name="search" placeholder="Search by keyword.." />
              <button>
                <img src="/src/assets/images/search-icon.svg" alt="" />
              </button>
            </form>
            <nav>
              <ul className="listTabs">
                <li
                  className={`tag--tab ${currentTag.toLowerCase() === 'all' ? 'tag--tabActive' : ''}`}
                  onClick={() => handleTagClick('all')}
                >
                  All
                </li>
                {tagsData?.map(tag => (
                  <li
                    key={tag.id}
                    className={`tag--tab ${currentTag.toLowerCase() === tag.name.toLowerCase() ? 'tag--tabActive' : ''}`}
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="articlesListSort">
            <p>
              Showing <span>{articles?.data?.length}</span> / <span>{articles?.total}</span>
            </p>
            <div>
              <label htmlFor="sort">Sort by:</label>
              <select
                name="sort"
                id="sort"
                value={currentSort}
                onChange={handleSortChange}
              >
                <option value="created_at,DESC">Newest</option>
                <option value="created_at,ASC">Oldest</option>
                <option value="title,ASC">Title A-Z</option>
                <option value="title,DESC">Title Z-A</option>
              </select>
            </div>
          </div>
          <div className="articlesList">
            {articles?.data.map(article => (
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
                  <div className="tag--articleCard">{article.tags?.[0]?.name || ''}</div>
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
        </div>
      </section>
    </main>
  );
};

export default ArticlesContainer;
