// app/api/delete-account/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        // ✅ CSRF Protection: Ensure request comes from your frontend domain
        const origin = request.headers.get('origin');
        const allowedOrigins =
        [ 
        process.env.NEXT_PUBLIC_BASE_URL,
        'http://localhost:3000'
        ]

        if (!allowedOrigins.includes(origin || '')) {
            return NextResponse.json(
                { error: 'CSRF protection: Invalid origin' },
                { status: 403 }
                );
            }

        // Check if service role key exists
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = await createClient();

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please log in' },
                { status: 401 }
            );
        }

        // Get and validate request data
        let userId;
        try {
            const body = await request.json();
            userId = body.userId;
        } catch (parseError) {
            console.error('Invalid JSON:', parseError);
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json(
                { error: 'Invalid user ID provided' },
                { status: 400 }
            );
        }

        // Ensure user can only delete their own account
        if (user.id !== userId) {
            return NextResponse.json(
                { error: 'Forbidden - Delete Your Account Only Phsyco 💩🤏' },
                { status: 403 }
            );
        }

        // Create admin client with service role key
        const supabaseAdmin = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Delete the profile first
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('user_id', userId);

        if (profileError) {
            return NextResponse.json(
                { error: 'Failed to delete profile data' },
                { status: 500 }
            );
        }

        // Then delete the user from auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Failed to delete user account' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Account deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// Only allow POST requests
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
