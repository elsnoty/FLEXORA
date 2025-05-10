'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '@/utils/validation/PasswordValidation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const UpdatePassword = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login'); // Redirect if not logged in
      } else {
        setIsAuthenticated(true);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleUpdate = async (data: { password: string }) => {
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("✅ Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    }
    setLoading(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Set New Password 🔑
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </Button>

            {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
