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


export async function triggerScriptWebhook(postId: string): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
        console.log('[triggerScriptWebhook] Triggering webhook for post:', postId)

        const response = await fetch('https://autowebhook.maxmizeai.com/webhook/c5a960e6-a475-4b47-bc4b-5215056fec96', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: postId
            })
        })

        if (!response.ok) {
            console.error(`[triggerScriptWebhook] Failed with status: ${response.status} ${response.statusText}`)
            return { success: false, error: `Status ${response.status}` }
        }

        // Try to parse as JSON, fallback to text if it's just raw markdown
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
            console.log('[triggerScriptWebhook] JSON response:', data);
        } else {
            data = await response.text();
            console.log('[triggerScriptWebhook] Text response:', data);
        }

        console.log('[triggerScriptWebhook] Success', typeof data)
        return { success: true, data }
    } catch (error) {
        console.error("[triggerScriptWebhook] Error:", error)
        return { success: false, error }
    }
}

export async function triggerKeywordSearchWebhook(keywords: string[], clientId: string): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
        console.log('[triggerKeywordSearchWebhook] Triggering webhook for keywords:', keywords, 'clientId:', clientId)

        const response = await fetch('https://autowebhook.maxmizeai.com/webhook/806ac6b6-1131-4667-996f-c1e5aa307027', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords: keywords,
                clientId: clientId
            })
        })

        if (!response.ok) {
            console.error(`[triggerKeywordSearchWebhook] Failed with status: ${response.status} ${response.statusText}`)
            return { success: false, error: `Status ${response.status}` }
        }

        const data = await response.json().catch(() => ({ status: 'ok' })); // Fallback if no json response
        console.log('[triggerKeywordSearchWebhook] Success')
        return { success: true, data }
    } catch (error) {
        console.error("[triggerKeywordSearchWebhook] Error:", error)
        return { success: false, error }
    }
}
