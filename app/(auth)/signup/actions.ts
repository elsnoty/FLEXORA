'use server'
import { createClient } from "@/utils/supabase/server"
import { SignupSchema } from "@/utils/validation/SignupValidation"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    const rowData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
    const result = SignupSchema.safeParse(rowData);

    if (!result.success) {
      return { error: "Invalid email or password format." };
    }

    const {email, password} =result.data
    const { error, data: exsitingUser } = await supabase.auth.signUp({email, password})
    
    if (exsitingUser) {
      return { error: "User already exists. Please log in instead." };
    }
    if (error) {
      return { error: error.message };
    }
  
    revalidatePath('/', 'layout')
    redirect('/login')
  }