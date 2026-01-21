"use server"

export interface WebhookReelData {
    id: string
    username: string
    caption: string
    timestamp: string
    viewCount: number
    likeCount: number
    commentCount: number
    videoUrl: string
    thumbnailUrl: string
    platform: 'instagram' | 'tiktok'
}

export async function fetchReelsFromWebhook(usernames: string[]): Promise<WebhookReelData[]> {
    try {
        const response = await fetch('https://autowebhook.maxmizeai.com/webhook/e0ac5252-b7f6-4de2-b3c0-a6dc8aff777b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    names: usernames
                }
            ])
        })

        if (!response.ok) {
            throw new Error(`Webhook request failed: ${response.status}`)
        }

        const data = await response.json()

        // Map the webhook response to our ReelData format
        // Adjust field mappings based on actual webhook response structure
        const reels: WebhookReelData[] = data.map((item: any) => ({
            id: item.id || item.shortcode || item.pk || `${item.username}_${Date.now()}`,
            username: item.username || item.owner?.username || '',
            caption: item.caption?.text || item.caption || '',
            timestamp: item.taken_at_timestamp
                ? new Date(item.taken_at_timestamp * 1000).toISOString()
                : item.timestamp || new Date().toISOString(),
            viewCount: item.video_view_count || item.play_count || item.view_count || 0,
            likeCount: item.like_count || item.likes || 0,
            commentCount: item.comment_count || item.comments || 0,
            videoUrl: item.video_url || item.video_versions?.[0]?.url || item.display_url || '',
            thumbnailUrl: item.thumbnail_url || item.display_url || item.image_versions2?.candidates?.[0]?.url || '',
            platform: 'instagram' as const
        }))

        return reels
    } catch (error) {
        console.error("Webhook fetch error:", error)
        throw new Error("Failed to fetch reels from webhook")
    }
}
