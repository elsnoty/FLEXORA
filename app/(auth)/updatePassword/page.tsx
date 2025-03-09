'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { passwordSchema } from '@/utils/validation/PasswordValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from "react-hook-form";


const UpdatePassword = () => {
  const [message, setMessage] = useState('')
  const supabse = createClient()
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({resolver: zodResolver(passwordSchema),});

  const handleUpdate = async (data: { password: string }) =>{
    setMessage('')
    setLoading(true);

    const {error } = await supabse.auth.updateUser({password: data.password})
    if (error) {
      setMessage("❌ Error: " + error.message);
    }else{
      setMessage("✅ Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    }
    setLoading(false);
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
  )
}

export default UpdatePassword
