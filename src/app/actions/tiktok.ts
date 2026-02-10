"use server"

interface TikTokOEmbedResponse {
    thumbnail_url: string
    thumbnail_width: number
    thumbnail_height: number
    title: string
    author_name: string
}

interface TikTokThumbnailResult {
    thumbnailUrl: string
    title: string
    authorName: string
}

export async function fetchTikTokThumbnail(videoUrl: string): Promise<TikTokThumbnailResult | null> {
    try {
        // Validate that this is a TikTok URL
        const urlObj = new URL(videoUrl)
        if (!urlObj.hostname.includes('tiktok.com')) {
            return null
        }

        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`

        const response = await fetch(oembedUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        if (!response.ok) {
            console.error(`[fetchTikTokThumbnail] oEmbed request failed: ${response.status}`)
            return null
        }

        const data: TikTokOEmbedResponse = await response.json()

        if (!data.thumbnail_url) {
            return null
        }

        return {
            thumbnailUrl: data.thumbnail_url,
            title: data.title || '',
            authorName: data.author_name || '',
        }
    } catch (error) {
        console.error('[fetchTikTokThumbnail] Error:', error)
        return null
    }
}

/**
 * Saves a thumbnail URL to the posts_scaped table for caching.
 * Uses postId to find the row, updates displayUrl with the oEmbed thumbnail.
 */
export async function saveThumbnailToDb(postId: string, thumbnailUrl: string): Promise<boolean> {
    try {
        const { createClient } = await import("@/lib/supabase/server")
        const supabase = await createClient()

        const { error } = await supabase
            .from('posts_scaped')
            .update({ displayUrl: thumbnailUrl })
            .eq('postId', postId)

        if (error) {
            console.error('[saveThumbnailToDb] Error:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('[saveThumbnailToDb] Unexpected error:', error)
        return false
    }
}
