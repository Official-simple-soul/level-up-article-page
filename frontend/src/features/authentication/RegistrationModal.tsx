import { useState, useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { Button, Modal, TextInput, FileInput } from '@mantine/core';
import { useAuth } from './contexts/AuthProvider';
import RegisterUser from 'types/RegisterUser';

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

interface RegistrationModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const RegistrationModal = ({ isOpen, closeModal }: RegistrationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      avatar: null
    },
    validate: zodResolver(registrationSchema)
  });

  const { register } = useAuth();

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: RegisterUser) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    await register(formData);
    console.log('Registration successful');

    setIsSubmitting(false);
    closeModal();
  };

  return (
    <Modal opened={isOpen} onClose={closeModal}>
      <h1 className="mb-4 text-center text-lg font-bold">Register</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput {...form.getInputProps('name')} label="Name" mb="sm" />
        <TextInput {...form.getInputProps('email')} label="Email" mb="sm" />
        <TextInput
          {...form.getInputProps('password')}
          label="Password"
          type="password"
          mb="lg"
        />
        <FileInput
          onChange={handleAvatarChange}
          label="Avatar (Image only)"
          mb="lg"
          accept="image/*"
        />
        {avatarPreview && <img src={avatarPreview} alt="Avatar preview" style={{ width: '100px', height: '100px' }} />}
        <Button loading={isSubmitting} type="submit">
          Register
        </Button>
      </form>
    </Modal>
  );
};

export default RegistrationModal;