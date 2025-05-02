'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { selectRoleAction } from './actions';

export default function SelectRolePage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const result = await selectRoleAction(formData);

        if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setLoading(false);
        return;
        }

        toast({ title: "Success", description: "Profile saved successfully" });
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/50 via-blue-200 to-blue-300 p-4 relative overflow-hidden">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-blue-300/30"
            animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'linear',
            }}
            style={{ backgroundSize: '200% 200%' }}
        />

        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
        >
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                Let’s Get Started ✨
                </CardTitle>
                <p className="text-gray-700">Complete your profile to dive in!</p>
            </CardHeader>

            <CardContent>
                <form action={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-800">
                    Your Name
                    </label>
                    <Input
                    name="name"
                    placeholder="Enter your name"
                    className="mt-1 bg-white/60 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="text-sm font-medium text-gray-800">
                    Your Role
                    </label>
                    <Select name="role">
                    <SelectTrigger className="mt-1 bg-white/60 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                        <SelectItem value="trainer">Trainer</SelectItem>
                        <SelectItem value="trainee">Trainee</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div>
                    <label htmlFor="gender" className="text-sm font-medium text-gray-800">
                    Your Gender
                    </label>
                    <Select name="gender">
                    <SelectTrigger className="mt-1 bg-white/60 text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                        <SelectItem value="male">male</SelectItem>
                        <SelectItem value="female">female</SelectItem>
                    </SelectContent>
                    </Select>
                </div>  

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
                >
                    {loading ? 'Saving...' : 'Continue'}
                </Button>
                </form>
            </CardContent>
            </Card>
        </motion.div>
    </div>
    );
}
