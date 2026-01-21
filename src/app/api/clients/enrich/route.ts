import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Use Server Client
import { getInstagramProfile } from '@/app/actions/apify';
import { enrichClientProfile } from '@/app/actions/groq';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        // Check Auth using server client (cookie based)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { clientId, instagramUsername, clientName } = body;

        if (!clientId || !instagramUsername) {
            return NextResponse.json({ error: 'Missing clientId or instagramUsername' }, { status: 400 });
        }

        // 1. Scrape Instagram Profile
        const profile = await getInstagramProfile(instagramUsername);

        if (!profile) {
            return NextResponse.json({ error: 'Failed to scrape profile or profile not found' }, { status: 404 });
        }

        // 2. Enrich Data with Gemini
        const richData = await enrichClientProfile(
            profile.fullName || clientName,
            profile.biography,
            profile.username,
            profile.postsCount,
            profile.followersCount
        );

        // 3. Update Client in Database (New Columns)
        const { error: updateError } = await supabase
            .from('clients')
            .update({
                logo_url: profile.profilePicUrl,
                followers_count: profile.followersCount,
                posts_count: profile.postsCount,
                views_count: Math.floor(profile.followersCount * 1.5), // Estimate
                category: richData.category,
                sub_category: richData.subCategory,
                niche_description: richData.nicheDescription,
                content_strategy: richData.contentStrategy, // Supabase handles Text[] if configured, or needs stringifying? text[] is native in Postgres.
                location: richData.location,
                target_audience: richData.targetAudience,
                tone_of_voice: richData.toneOfVoice,
                key_competitors: richData.keyCompetitors,
                // We keep brief as legacy info for now or overwrite if user prefers. 
                // Let's overwrite brief with the niche description for immediate UI visibility in non-updated components
                brief: richData.nicheDescription
            } as any) // Cast as any because types.ts isn't updated with new columns yet
            .eq('id', clientId);

        if (updateError) {
            console.error("DB Update Error", updateError);
            return NextResponse.json({ error: 'Failed to update database', details: updateError }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                logo_url: profile.profilePicUrl,
                followers_count: profile.followersCount,
                posts_count: profile.postsCount,
                views_count: Math.floor(profile.followersCount * 1.5),
                category: richData.category,
                sub_category: richData.subCategory,
                niche_description: richData.nicheDescription
            }
        });

    } catch (error) {
        console.error("Enrichment API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
