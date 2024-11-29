import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'features/authentication/contexts/AuthProvider';
import { notifications } from '@mantine/notifications';
import { Modal, Button, Avatar, FileInput, TextInput } from '@mantine/core';
import axios from 'axios';
import './EditProfile.scss';

import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { API_URL } from 'config';
import { updateUser, deleteUser } from 'utils/users';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  slug: z.string().optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfile = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ? `${API_URL}/storage/${user.avatar}` : null);

  const form = useForm<ProfileFormValues>({
    validate: zodResolver(profileSchema),
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      slug: user?.slug || '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || '',
        email: user.email || '',
        slug: user.slug || '',
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      setAvatarPreview(user.avatar ? `${API_URL}/storage/${user.avatar}` : null);
    }
  }, [user]);

  const handleSubmit = async (values: typeof form.values) => {
    const formPayload = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formPayload.append(key, value || '');
    });

    if (avatar) {
      formPayload.append('avatar', avatar);
    }

    try {
      await updateUser(user?.id!, formPayload);
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'An unexpected error occurred',
          color: 'red',
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user?.id!);
      logout();
      navigate('/');
      notifications.show({
        title: 'Success',
        message: 'Profile deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete profile',
        color: 'red',
      });
    }
    setIsDeleting(false);
  };

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <main className="editProfile">
      <section className="profileHero">
        <div className="container--profileHero">
          <div className="profileHero__left">
            <h1>
              Edit profile
            </h1>
            <ul>
              <li>
                <Link to="/profile">← Back to profile</Link>
              </li>
              <li>
                <Link to="/profile/subscription">Edit subscription →</Link>
              </li>
            </ul>
          </div>
          <div className="profileHeroImage">
            <FileInput
              accept="image/*"
              onChange={handleAvatarChange}
              className="profileHeroImage__fileInput"
              style={{ width: 0, height: 0, position: 'absolute' }}
              label={
                <div style={{ cursor: 'pointer' }}>
                  <Avatar
                    src={avatarPreview}
                    size={130}
                    radius="100%"
                    alt="Profile picture"
                    className="profileHeroImage__avatar"
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 12.5C25 19.404 19.404 25 12.5 25S0 19.404 0 12.5 5.596 0 12.5 0 25 5.596 25 12.5" fill="#fff" />
                    <path d="M15.197 7.773a.237.237 0 0 0-.337 0l-.996.997a.24.24 0 0 0 0 .336l1.698 1.699a.236.236 0 0 0 .337 0l.996-.996a.24.24 0 0 0 0-.337zm3.307-.485L17.38 6.165a.24.24 0 0 0-.169-.07.24.24 0 0 0-.168.07l-.678.678a.24.24 0 0 0-.07.168c0 .064.025.124.07.169l1.123 1.123a.237.237 0 0 0 .337 0l.678-.678a.24.24 0 0 0 0-.337m-5.612 2.811a.24.24 0 0 0-.168-.07.24.24 0 0 0-.168.07l-6.618 6.617a.24.24 0 0 0 0 .337l.32.32-.527 1.393c-.028.074-.013.119.004.143q.032.045.093.045a.2.2 0 0 0 .075-.015l1.394-.527.32.32a.24.24 0 0 0 .168.069.24.24 0 0 0 .168-.07l6.617-6.617a.24.24 0 0 0 0-.337z" fill="#2CBCFF" />
                  </svg>
                </div>
              }
            />
          </div>
        </div>
      </section>
      <form onSubmit={form.onSubmit(handleSubmit)} className="editProfileForm container">
        <TextInput
          label="Email"
          {...form.getInputProps('email')}
          required
        />

        <TextInput
          label="Name"
          {...form.getInputProps('name')}
          required
        />

        <TextInput
          label="Slug"
          {...form.getInputProps('slug')}
        />

        <TextInput
          type="password"
          label="Current Password"
          {...form.getInputProps('password')}
        />

        <TextInput
          type="password"
          label="New Password"
          {...form.getInputProps('newPassword')}
        />

        <TextInput
          type="password"
          label="Repeat Password"
          {...form.getInputProps('confirmPassword')}
        />

        <Button
          type="submit"
          disabled={form.isSubmitting}
          color="blue"
          fullWidth
          className="button--create"
          styles={{
            root: {
              width: '100%',
              maxWidth: '352px',
              color: 'black',
              margin: '0 auto',
              marginTop: '1rem',
              display: 'block',
              borderRadius: '55px'
            }
          }}
        >
          {form.isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </form>

      <Button
        onClick={() => setIsDeleting(true)}
        className="button--delete"
        color="red"
        variant="outline"
        fullWidth
        styles={{
          root: {
            textAlign: 'center',
            margin: '0 auto',
            display: 'block',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#FF2CB5'
          }
        }}
      >
        Delete profile
      </Button>

      <Modal
        opened={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Profile"
      >
        <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
        <div className="modalActions">
          <Button color="gray" onClick={() => setIsDeleting(false)}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </main>
  );
};

export default EditProfile; 