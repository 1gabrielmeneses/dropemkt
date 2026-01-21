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
    displayUrl?: string
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
        const reels: WebhookReelData[] = data.map((item: any) => ({
            id: item.id || item.shortcode || `${Date.now()}_${Math.random()}`,
            username: item.username || 'Unknown', // n8n sample doesn't show username, fallback
            caption: item.caption || '',
            timestamp: item.timestamp || new Date().toISOString(),
            viewCount: item.videoPlayCount || item.videoViewCount || item.viewCount || 0,
            likeCount: item.likesCount || item.likeCount || 0,
            commentCount: item.commentsCount || item.commentCount || 0,
            videoUrl: item.url || item.videoUrl || '', // 'url' in sample is permalink
            thumbnailUrl: item.displayUrl || item.thumbnailUrl || '', // 'displayUrl' in sample
            displayUrl: item.displayUrl,
            platform: 'instagram' as const
        }))

        return reels
    } catch (error) {
        console.error("Webhook fetch error:", error)
        throw new Error("Failed to fetch reels from webhook")
    }
}
