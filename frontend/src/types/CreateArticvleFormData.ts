import ApiArticle from './ApiArticle';

type CreateArticleFormData = Omit<ApiArticle, 'id'>;

export default CreateArticleFormData;
