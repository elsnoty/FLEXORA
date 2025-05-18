import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';

    // Return empty array if no query
    if (!query) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from('trainers')
      .select(`
        user_id,
        specialization,
        hourly_rate,
        is_active,
        profiles:user_id(
          name,
          avatar_url
        )
      `)
      .ilike('profiles.name', `%${query}%`)
      .eq('is_active', true)
      .limit(10);

    if (error) throw error;

    // Filter out any null profiles (if join fails)
    const filteredData = data?.filter((t: any) => t.profiles !== null) || [];
    
    return NextResponse.json(filteredData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search trainers' },
      { status: 500 }
    );
  }
}