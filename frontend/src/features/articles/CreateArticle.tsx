import { useState, useEffect } from 'react';
import { Title, TextInput, Button, FileInput, FileButton, Avatar, Textarea, Modal, Grid, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from 'features/authentication/contexts/AuthProvider';
import CreateArticleFormData from 'types/CreateArticvleFormData';
import useCreateArticle from './server/useCreateArticle';
import useDeleteArticle from './server/useDeleteArticle';
import { Link, useParams, useNavigate, useLoaderData } from 'react-router-dom';
import { API_URL } from 'config';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { FileWithPath } from '@mantine/dropzone';
import type { Article } from 'types/Article';
import { useQuery } from '@tanstack/react-query';
import { getTags, createTag } from '../../utils/articles';
import { Tag } from 'types/tag';

const CreateArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [value, setValue] = useState<Date | null>(null);
  const article = useLoaderData() as Article;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [newTag, setNewTag] = useState('');

  const form = useForm<CreateArticleFormData>({
    initialValues: {
      title: '',
      content: '',
      slug: '',
      cover_url: null,
      publication_date: null
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title must be at least 3 characters' : null),
      content: (value) => (value.length < 10 ? 'Content must be at least 10 characters' : null),
      slug: (value) => (value.length < 3 ? 'Slug is required' : null),
      publication_date: (value) => (!value ? 'Publication date is required' : null)
    },
    transformValues: (values) => ({
      ...values,
      cover_url: values.cover_url || null
    })
  });

  const { user, logout } = useAuth();

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags
  });

  const createMutation = useCreateArticle({
    onSuccess: (data) => {
      notifications.show({
        title: 'Success',
        message: `Article ${articleId ? 'updated' : 'created'} successfully`,
        color: 'green'
      });
      navigate(`/articles/${data.id}`);
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || `Failed to ${articleId ? 'update' : 'create'} article`,
        color: 'red'
      });
    }
  });

  const { isPending: isLoading } = createMutation;

  const deleteMutation = useDeleteArticle({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Article deleted successfully',
        color: 'green'
      });
      navigate('/articles');
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete article',
        color: 'red'
      });
    }
  });

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some(selected => selected.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId: number) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = (values: CreateArticleFormData) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('slug', values.slug);
    formData.append('publication_date', values.publication_date?.toISOString() || '');

    if (values.cover_url instanceof File) {
      formData.append('cover_url', values.cover_url);
    }

    selectedTags.forEach(tag => {
      formData.append('tags[]', tag.id.toString());
    });

    createMutation.mutate({
      formData,
      ...(articleId ? { id: articleId } : {})
    });
  };

  const handleDelete = () => {
    if (articleId) {
      deleteMutation.mutate(articleId);
      setDeleteModalOpen(false);
    }
  };

  const handleAddNewTag = async () => {
    if (newTag.trim()) {
      try {
        const createdTag = await createTag(newTag);

        setSelectedTags([...selectedTags, createdTag]);
        setNewTag('');
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: error.message || 'Failed to add new tag',
          color: 'red'
        });
      }
    }
  };

  useEffect(() => {
    if (article) {
      form.setValues({
        title: article.title,
        content: article.content,
        slug: article.slug,
        cover_url: article.cover_url,
        publication_date: article.publication_date ? new Date(article.publication_date) : null
      });
      if (article.cover_url) {
        setImagePreview(`${API_URL}/storage/${article.cover_url}`);
      }
      console.log(article, 'article.tags')
      setSelectedTags(article.tags || []);
    }
  }, [article]);

  if (articleId && isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <main className="createArticle">
      <section className="profileHero">
        <div className="container--profileHero">
          <div className="profileHero__left">
            <h1>{articleId ? 'Edit' : 'Create'} article</h1>
            <ul>
              <li>
                <Link to="/profile">← Back to profile</Link>
              </li>
              {articleId && (
                <li>
                  <Link to={`/articles/${articleId}`}>View article →</Link>
                </li>
              )}
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
      <section className="createArticle__form container">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Title"
                placeholder="Enter article title"
                {...form.getInputProps('title')}
                mb="md"
                styles={{
                  input: {
                    height: '48px'
                  }
                }}
              />

              <TextInput
                label="Slug"
                placeholder="article-slug"
                {...form.getInputProps('slug')}
                mb="md"
                styles={{
                  input: {
                    height: '48px'
                  }
                }}
              />

              <Textarea
                label="Content"
                placeholder="Write your article content here..."
                minRows={6}
                {...form.getInputProps('content')}
                mb="md"
                styles={{
                  label: {
                    height: '30px'
                  }
                }}
              />

              <FileInput
                label="Featured image"
                placeholder="Select image || selected-image.png"
                accept="image/*"
                {...form.getInputProps('cover_url')}
                mb="md"
                clearable
                onChange={(file) => {
                  form.setFieldValue('cover_url', file);
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  } else {
                    setImagePreview(null);
                  }
                }}
              />

              {imagePreview && (
                <div style={{ marginBottom: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <DatePickerInput
                label="Publication Date"
                placeholder="Pick a date"
                {...form.getInputProps('publication_date')}
                mb="md"
                clearable={false}
              />
              <label>Tags</label>
              <div className="selected-tags">
                {selectedTags.map(tag => (
                  <div key={tag.id} className="tag">
                    {tag.name} <button type="button" onClick={() => handleTagRemove(tag.id)}>×</button>
                  </div>
                ))}
                <div className="add-tag-input">
                  <TextInput
                    placeholder="Add new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.currentTarget.value)}
                    style={{ marginRight: '8px', maxWidth: '150px' }}
                  />
                  <Button onClick={handleAddNewTag}>Add new +</Button>
                </div>
              </div>
              <label>Search tags</label>
              <TextInput
                placeholder="Search tag name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.currentTarget.value)}
              />
              <div className="tag-suggestions">
                {filteredTags?.map(tag => (
                  <button type="button" className="tag" key={tag.id} onClick={() => handleTagSelect(tag)}>
                    {tag.name} +
                  </button>
                ))}
              </div>
            </Grid.Col>
          </Grid>

          <Grid mt="xl">
            <Grid.Col>
              <Button
                type="submit"
                size="md"
                loading={createMutation.isPending}
                className="button--create"
                styles={{
                  root: {
                    width: '100%',
                    maxWidth: '352px',
                    color: 'black',
                    margin: '0 auto',
                    display: 'block',
                    borderRadius: '55px'
                  }
                }}
              >
                {articleId ? 'Update' : 'Create'} Article
              </Button>
            </Grid.Col>
            {articleId && (
              <Grid.Col>
                <Button
                  variant="subtle"
                  color=""
                  onClick={() => setDeleteModalOpen(true)}
                  loading={deleteMutation.isPending}
                  styles={{
                    root: {
                      textAlign: 'center',
                      margin: '0 auto',
                      display: 'block',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#FF2CB5',
                    }
                  }}
                >
                  Delete article
                </Button>
              </Grid.Col>
            )}
          </Grid>
        </form>
      </section>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Article"
      >
        <p>Are you sure you want to delete this article? This action cannot be undone.</p>
        <Grid position="right" mt="md">
          <Grid.Col span="content">
            <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </Grid.Col>
          <Grid.Col span="content">
            <Button
              color="red"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
    </main>
  );
};

export default CreateArticle;
