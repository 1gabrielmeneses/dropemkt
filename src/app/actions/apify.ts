
"use server"

import { ApifyClient } from 'apify-client';

const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export interface CompetitorSearchResult {
    id: string
    username: string
    fullName: string
    avatarUrl: string
    followersCount?: number
    platform: 'instagram' | 'tiktok'
    profileUrl: string
}

export interface InstagramProfile {
    username: string
    fullName: string
    biography: string
    followersCount: number
    followsCount: number
    postsCount: number
    profilePicUrl: string
    externalUrl?: string
    isVerified: boolean
}

export async function searchCompetitors(
    query: string,
    platform: 'instagram' | 'tiktok',
    strategy: string[] = []
): Promise<CompetitorSearchResult[]> {
    if (!process.env.APIFY_API_TOKEN) {
        throw new Error("APIFY_API_TOKEN is not set")
    }

    try {
        let items: any[] = []

        if (platform === 'instagram') {
            // Using n8n webhook for search
            const webhookUrl = 'https://autowebhook.maxmizeai.com/webhook/eaeb8169-e863-406c-a645-5f5163dd714a';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: query
                }),
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`Webhook failed with status: ${response.status}`);
            }

            const data = await response.json();

            // Assume webhook returns items directly or { items: [...] } or similar structure
            // Adjust based on typical n8n output. Usually it returns the JSON array or object
            // If it returns { "results": [...] } or just [...]
            items = Array.isArray(data) ? data : (data.items || data.results || []);

        } else {
            // Using clockworks/tiktok-search-scraper
            const run = await apifyClient.actor('clockworks/tiktok-search-scraper').call({
                search: query,
                resultsPerPage: 30,
            });
            const { items: datasetItems } = await apifyClient.dataset(run.defaultDatasetId).listItems();
            items = datasetItems
        }

        // Map Results
        if (platform === 'instagram') {
            return items.map((item: any) => ({
                id: item.id || item.username,
                username: item.username,
                fullName: item.full_name || item.fullName || item.username, // Webhook might not return fullName, fallback to username
                avatarUrl: item.profilePicUrl || item.profile_pic_url || item.avatarUrl || '',
                followersCount: item.followersCount || item.followers_count || undefined,
                postsCount: item.postsCount || item.posts_count || undefined,
                isVerified: item.verified ?? item.is_verified ?? item.isVerified ?? false,
                platform: 'instagram' as const,
                profileUrl: `https://instagram.com/${item.username}`
            })).filter(i => i.username);
        } else {
            return items.map((item: any) => ({
                id: item.id || item.authorMeta?.name || item.text,
                username: item.authorMeta?.name || item.uniqueId || 'unknown',
                fullName: item.authorMeta?.nickName || item.nickname || '',
                avatarUrl: item.authorMeta?.avatar || item.avatar || '',
                followersCount: item.authorMeta?.fans || item.authorStats?.diggCount || undefined, // TikTok scraper output varies
                platform: 'tiktok' as const,
                profileUrl: `https://tiktok.com/@${item.authorMeta?.name}`
            })).filter(i => i.username !== 'unknown');
        }

    } catch (error: any) {
        console.error("Apify Search Error DETAILS:", JSON.stringify(error, null, 2))
        if (error instanceof Error) {
            console.error("Apify Search Error Message:", error.message)
            console.error("Apify Search Error Stack:", error.stack)
        }
        throw new Error(`Failed to search competitors: ${error?.message || "Unknown error"}`)
    }
}

export async function getInstagramProfile(username: string): Promise<InstagramProfile | null> {
    if (!process.env.APIFY_API_TOKEN) {
        console.warn("APIFY_API_TOKEN not set, returning mock data");
        // Mock data for development if no token
        return {
            username: username,
            fullName: "Mock User",
            biography: "This is a mock bio because API key is missing. #gym #fitness",
            followersCount: 12500,
            followsCount: 450,
            postsCount: 120,
            profilePicUrl: "https://github.com/shadcn.png",
            isVerified: false
        };
    }

    try {
        // Using apify/instagram-profile-scraper
        const run = await apifyClient.actor('apify/instagram-profile-scraper').call({
            usernames: [username],
            resultsLimit: 1,
        });

        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

        if (items.length === 0) return null;

        const item = items[0] as any;

        return {
            username: item.username,
            fullName: item.fullName || item.full_name,
            biography: item.biography,
            followersCount: item.followersCount || item.followers_count,
            followsCount: item.followsCount || item.follows_count,
            postsCount: item.postsCount || item.posts_count,
            profilePicUrl: item.profilePicUrl || item.profile_pic_url,
            externalUrl: item.externalUrl || item.external_url,
            isVerified: item.isVerified || item.is_verified
        };

    } catch (error) {
        console.error("Apify Profile Scrape Error:", error);
        return null;
    }
}

export interface ReelData {
    id: string
    username: string
    caption: string
    timestamp: string // ISO date string
    viewCount: number
    likeCount: number
    commentCount: number
    videoUrl: string
    thumbnailUrl: string
    platform: 'instagram' | 'tiktok'
}

export async function fetchCompetitorReels(usernames: string[]): Promise<ReelData[]> {
    if (!process.env.APIFY_API_TOKEN) {
        throw new Error("APIFY_API_TOKEN is not set")
    }

    try {
        const allReels: ReelData[] = []

        // Fetch reels for each competitor
        for (const username of usernames) {
            try {
                // Using apify/instagram-reel-scraper
                const run = await apifyClient.actor('apify/instagram-reel-scraper').call({
                    usernames: [username],
                    resultsLimit: 20, // Get last 20 reels per competitor
                });

                const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

                // Map and add to results
                const reels = items.map((item: any) => ({
                    id: item.id || item.shortCode || `${username}_${Date.now()}`,
                    username: username,
                    caption: item.caption || item.text || '',
                    timestamp: item.timestamp || item.takenAtTimestamp || item.created_time || new Date().toISOString(),
                    viewCount: item.videoViewCount || item.playCount || item.views || 0,
                    likeCount: item.likesCount || item.likes || item.diggCount || 0,
                    commentCount: item.commentsCount || item.comments || item.commentCount || 0,
                    videoUrl: item.videoUrl || item.video_url || item.displayUrl || '',
                    thumbnailUrl: item.thumbnailUrl || item.thumbnail_url || item.displayUrl || '',
                    platform: 'instagram' as const
                }))

                allReels.push(...reels)
            } catch (error) {
                console.error(`Error fetching reels for ${username}:`, error)
                // Continue with other usernames
            }
        }

        return allReels
    } catch (error) {
        console.error("Apify Reels Fetch Error:", error)
        throw new Error("Failed to fetch competitor reels")
    }
}
