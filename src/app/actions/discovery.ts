"use server"

import { createClient } from "@/lib/supabase/server"
import { WebhookReelData } from "@/app/actions/webhook"

interface ScrapedPost {
    id: number
    created_at: string
    cliente_conectado: string | null
    postId: string | null
    postCaption: string | null
    postUrl: string | null
    commentsCount: number | null
    likesCount: number | null
    videoCount: number | null
    videoPlayCount: number | null
    displayUrl: string | null
}

export async function getScrapedPosts(clientId: string): Promise<WebhookReelData[]> {
    console.log('[getScrapedPosts] Called with clientId:', clientId)
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts_scaped')
            .select('*')
            .eq('cliente_conectado', clientId)
            .order('videoPlayCount', { ascending: false }) // Default sorting by views

        console.log('[getScrapedPosts] Query results - data count:', data?.length, 'error:', error)

        if (error) {
            console.error("[getScrapedPosts] Error fetching scraped posts:", error)
            return []
        }

        if (!data) {
            console.log('[getScrapedPosts] No data returned')
            return []
        }

        // Map database rows to WebhookReelData interface
        const reels: WebhookReelData[] = data.map((post) => ({
            id: post.postId || post.id.toString(),
            username: 'Unknown', // Not stored in this table
            caption: post.postCaption || '',
            timestamp: new Date(post.created_at).toISOString(),
            viewCount: post.videoPlayCount || post.videoCount || 0,
            likeCount: post.likesCount || 0,
            commentCount: post.commentsCount || 0,
            videoUrl: post.postUrl || '',
            thumbnailUrl: post.displayUrl || '',
            displayUrl: post.displayUrl || undefined,
            platform: 'instagram' as const
        }))

        console.log('[getScrapedPosts] Returning reels count:', reels.length)
        return reels
    } catch (error) {
        console.error("[getScrapedPosts] Unexpected error fetching posts:", error)
        return []
    }
}
