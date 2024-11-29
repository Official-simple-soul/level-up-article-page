import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
}

const BasicReactQuery = () => {
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    const response = await axios.get<Post[]>(
      'https://jsonplaceholder.typicode.com/posts'
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchData,
    staleTime: 10 * 1000
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log('rendering');

  return (
    <main>
      <h1>Basic React Query</h1>
      <article>
        <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
        <p>Count: {count}</p>
      </article>
      <div>{data?.map((item) => <li key={item.id}>{item.title}</li>)}</div>
    </main>
  );
};

export default BasicReactQuery;
