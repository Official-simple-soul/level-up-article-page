import useGetArticles from './server/useGetArticles';
import SearchParams from './types/SearchParams';

interface ArticlesListProps {
  searchParams: SearchParams;
}

const ArticlesList = ({ searchParams }: ArticlesListProps) => {
  const { data, isLoading, error } = useGetArticles(searchParams);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.data.length === 0) {
    return <div>No articles found</div>;
  }

  if (error) {
    return <div>Error in results</div>;
  }

  return (
    <div className="articlesList">
      {/* <!-- start articleCard --> */}
      {data?.data.map((article) => (
        <a href="" className="articleCard" key={article.id}>
          <div className="premiumFlag--articleCard">
            <img className="" src="/assets/images/premium-icon.svg" />
          </div>
          <div className="articleCard__imgBox">
            <img src="https://picsum.photos/500/380" alt="" />
          </div>
          <div className="articleCard__body">
            <div className="tag--articleCard">{article.tags?.[0]?.name || ''}</div>
            <div className="cardContent cardContent--articleCard">
              <p className="cardContent__date">{new Date(article.created_at).toLocaleDateString()}</p>
              <h3 className="cardContent__title">{article.title}</h3>
              <p className="cardContent__author">By: {article.author?.name}</p>
            </div>
          </div>
        </a>
      ))}

      {/* end articleCard */}
    </div>
  );
};

export default ArticlesList;
