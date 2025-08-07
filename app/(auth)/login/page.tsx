import { authMetadata } from '@/lib/auth-metadata';
import LoginForm from './LoginForm';

export const metadata = authMetadata.login;

export default function LoginPage() {
  return <LoginForm />;
}