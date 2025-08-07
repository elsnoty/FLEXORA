'use client'
import { useState } from "react";
import {createClient} from '../../../utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestPassword(){
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const supabase = createClient()
    const [loading, setLoading] = useState(false);

    const handleRest = async(e: React.FormEvent)=>{
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/updatePassword`
        })
    
        if (error) {
            setMessage("❌ Error: " + error.message);
            } else {
                setMessage("✅ Check your email for a reset link.");
            }
            setLoading(false);
        }
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-xl">
                <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                    Reset Password 🔒
                </CardTitle>
                <p className="text-center text-gray-500">
                    Enter your email to receive a password reset link.
                </p>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleRest} className="space-y-4">
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
        
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                    </Button>
        
                    {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
                </form>
                </CardContent>
            </Card>
            </div>
        );
}