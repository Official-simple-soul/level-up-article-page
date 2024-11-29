interface RegisterUser {
  name: string;
  email: string;
  password: string;
  avatar: File | null;
}

export default RegisterUser;
