import { formatDistanceToNow } from 'date-fns';
import { Comment } from '../../types/comment';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="comment">
      <img
        src={comment?.author?.avatar || '/src/assets/images/Jane_joe-min.png'}
        alt={comment?.author?.name}
        className="comment__avatar"
      />
      <div className="comment__content">
        <div className="comment__header">
          <h4 className="comment__author">{comment?.author?.name}</h4>
          <span className="comment__date">
            {formatDistanceToNow(new Date(comment?.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="comment__text">{comment?.content}</p>
      </div>
    </div>
  );
};
