import { useForm, zodResolver } from '@mantine/form';
import LoginForm from './types/LoginForm';
import { z } from 'zod';
import { Button, Modal, TextInput } from '@mantine/core';
import { useAuth } from './contexts/AuthProvider';
import { useState } from 'react';
import RegistrationModal from './RegistrationModal';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

interface LoginFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const LoginFormModal = ({ isOpen, closeModal }: LoginFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: zodResolver(formSchema)
  });

  const { login } = useAuth();

  const handleSubmit = async (values: LoginForm) => {
    setIsSubmitting(true);
    await login(values);
    console.log('handleSubmit from LoginFormModal - login already called');

    setIsSubmitting(false);
    closeModal();
  };

  return (
    <Modal opened={isOpen} onClose={closeModal}>
      <h1 className="mb-4 text-center text-lg font-bold">Login</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput {...form.getInputProps('email')} label="Email" mb="sm" />
        <TextInput
          {...form.getInputProps('password')}
          label="Password"
          type="password"
          mb="lg"
        />
        <Button loading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
      <p className="text-center mt-4">
        No account?{' '}
        <span className="text-blue-500 cursor-pointer" onClick={() => setIsRegistering(true)}>
          Register here
        </span>
      </p>
      <RegistrationModal isOpen={isRegistering} closeModal={() => setIsRegistering(false)} />
    </Modal>
  );
};

export default LoginFormModal;
