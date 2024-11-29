import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BasicReactQuery from 'routes/BasicReactQuery';
import Root from 'routes/Root';
import Layout from './Layout';
import { MantineProvider } from '@mantine/core';
import AuthProvider from 'features/authentication/contexts/AuthProvider';
import ProtectedRoute from 'features/authentication/ProtectedRoute';
import ErrorPage from 'routes/ErrorElement';
import ArticlesPage from 'routes/ArticlesPage';
import ArticlePage from 'routes/ArticlePage';
import { articlesLoader, articleLoader } from 'features/articles/loaders';
import { Notifications } from '@mantine/notifications';
import ProfilePage from 'routes/ProfilePage';
import CreateArticle from 'features/articles/CreateArticle';
import EditProfile from 'features/profile/EditProfile';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import 'dayjs/locale/ru';
import { DatesProvider, MonthPickerInput, DatePickerInput } from '@mantine/dates';
const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/',
            element: <Root />,
            loader: articlesLoader,
          },
          {
            path: '/basic-react-query',
            element: <BasicReactQuery />
          },
          {
            path: '/articles',
            element: <ArticlesPage />,
            loader: articlesLoader
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
            loader: ({ request }) => articlesLoader({
              request,
              filter: { authorId: true }
            })
          },
          {
            path: '/articles/create',
            element: (
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            )
          },
          {
            path: '/articles/:articleId',
            element: <ArticlePage />,
            loader: articleLoader,
          },
          {
            path: '/articles/:articleId/edit',
            element: (
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            ),
            loader: articleLoader,
          },
          {
            path: '/profile/edit',
            element: (
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            )
          },
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient();

function App() {
  return (
    <StrictMode>
      <MantineProvider forceColorScheme="dark">
        <Notifications
          position="top-right"
          zIndex={2000}
          containerWidth={400}
          autoClose={4000}
        />
        <DatesProvider settings={{}}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
          </QueryClientProvider>
        </DatesProvider>
      </MantineProvider>
    </StrictMode>
  );
}

export default App;
