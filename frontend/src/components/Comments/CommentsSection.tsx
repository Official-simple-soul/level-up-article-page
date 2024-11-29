import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import { Comment } from '../../types/comment';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { getComments, createComment } from 'utils/comments';

interface CommentsSectionProps {
  articleId: string | number;
}

export const CommentsSection = ({ articleId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getComments(articleId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    try {
      const newComment = await createComment(articleId, content);
      setComments(prev => [...prev, newComment]);
      return true;
    } catch (err: any) {
      if (err.response?.status === 401) {
        notifications.show({
          color: 'red',
          title: 'Authentication Required',
          message: 'Please log in to post comments',
          icon: <IconX size="1.1rem" />,
          position: 'top-right',
          autoClose: 4000,
        });
      } else {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: 'Failed to post comment. Please try again.',
          icon: <IconX size="1.1rem" />,
          position: 'top-right',
          autoClose: 4000,
        });
      }
      throw err;
    }
  };

  if (isLoading) {
    return <div className="comments__loading">Loading comments...</div>;
  }

  if (error) {
    return <div className="comments__error">{error}</div>;
  }

  return (
    <div className="comments">
      <div className="comments__container">
        <h3 className="comments__title">Comments</h3>
        <CommentForm onSubmit={handleSubmitComment} />
        {comments.length > 0 ? (
          <CommentList comments={comments} />
        ) : (
          <Text c="dimmed" ta="center" mt="md">
            No comments yet. Be the first to comment!
          </Text>
        )}
      </div>
    </div>
  );
};
