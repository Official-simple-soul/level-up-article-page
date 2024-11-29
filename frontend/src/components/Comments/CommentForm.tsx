import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { Button, Textarea } from '@mantine/core';

const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters')
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  userAvatar?: string;
}

export const CommentForm = ({ onSubmit, userAvatar }: CommentFormProps) => {
  const form = useForm<CommentFormValues>({
    validate: zodResolver(commentSchema),
    initialValues: {
      content: '',
    },
  });

  const handleSubmit = async (values: CommentFormValues) => {
    try {
      await onSubmit(values.content);
      form.reset();
    } catch (error) {
      // Handle error if needed
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="comments__form">
      <img
        src={userAvatar || '/src/assets/images/default-avatar.png'}
        alt="Your avatar"
        className="comments__form-avatar"
      />
      <div className="comments__form-input-wrapper">
        <Textarea
          {...form.getInputProps('content')}
          placeholder="Write a comment..."
          className="comments__form-input"
          autosize
          minRows={1}
          maxRows={4}
        />
      </div>
      <Button
        type="submit"
        className="comments__form-submit"
        loading={form.isSubmitting}
        disabled={!form.values.content.trim()}
      >
        Send
      </Button>
    </form>
  );
};
