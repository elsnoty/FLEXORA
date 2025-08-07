import { authMetadata } from '@/lib/auth-metadata';
import Signup from './SingupForm';

export const metadata = authMetadata.signup;

export default function LoginPage() {
  return <Signup />;
}