import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegistrationModal from '../RegistrationModal';
import { useAuth } from '../contexts/AuthProvider';

jest.mock('../contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('RegistrationModal', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ register: mockRegister });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('submits the registration form with correct data', async () => {
    render(
      <MemoryRouter>
        <RegistrationModal isOpen={true} closeModal={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/register/i));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }));
    });
  });

  it('displays validation errors on invalid submission', async () => {
    render(
      <MemoryRouter>
        <RegistrationModal isOpen={true} closeModal={() => { }} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/register/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
});