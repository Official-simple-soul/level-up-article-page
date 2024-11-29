import { Text, Title } from '@mantine/core';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Title order={2}>Sorry, an unexpected error has occurred.</Title>
      <Text size="md">{errorMessage}</Text>
    </div>
  );
};

export default ErrorPage;
