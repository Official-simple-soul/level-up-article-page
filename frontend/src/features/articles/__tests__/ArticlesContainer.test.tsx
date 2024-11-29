import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArticlesContainer from '../ArticlesContainer';
import { useLoaderData } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}));

describe('ArticlesContainer', () => {
  const mockArticles = {
    data: [
      { id: 1, title: 'Test Article 1', cover_url: 'test1.jpg', premium: false, created_at: '2023-01-01', author: { name: 'Author 1' }, tags: [{ name: 'Tag1' }] },
      { id: 2, title: 'Test Article 2', cover_url: 'test2.jpg', premium: false, created_at: '2023-01-02', author: { name: 'Author 2' }, tags: [{ name: 'Tag2' }] },
    ],
    total: 2,
  };

  beforeEach(() => {
    useLoaderData.mockReturnValue(mockArticles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders articles and navigates to the article page when an article card is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/articles']}>
        <ArticlesContainer />
      </MemoryRouter>
    );

    const articleCard = screen.getByText('Test Article 1');
    fireEvent.click(articleCard);

    expect(window.location.pathname).toBe('/articles/1');
  });
});