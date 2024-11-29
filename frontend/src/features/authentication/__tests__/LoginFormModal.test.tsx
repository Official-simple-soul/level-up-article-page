import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginFormModal from '../LoginFormModal';
import { useAuth } from '../contexts/AuthProvider';

jest.mock('../contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('LoginFormModal', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
  });

  afterEach(() => {
    jest.clearAllMocks()
  });

  it('displays validation errors on invalid submission', async () => {
    render(
      <MemoryRouter>
        <LoginFormModal isOpen={true} closeModal={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('calls login function with correct data', async () => {
    render(
      <MemoryRouter>
        <LoginFormModal isOpen={true} closeModal={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});