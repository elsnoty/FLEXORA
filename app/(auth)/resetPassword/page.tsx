import { authMetadata } from '@/lib/auth-metadata';
import RestPassword from './RestPassword';

export const metadata = authMetadata.forgotPassword;

export default function LoginPage() {
  return <RestPassword />;
}