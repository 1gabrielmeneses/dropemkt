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
    plataform: string | null
}

export async function getScrapedPosts(clientId: string): Promise<WebhookReelData[]> {
    console.log('[getScrapedPosts] Called with clientId:', clientId)
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts_scaped')
            .select('*')
            .eq('cliente_conectado', clientId)
            .order('created_at', { ascending: false })
            .order('videoPlayCount', { ascending: false })
            .order('likesCount', { ascending: false })
            .order('commentsCount', { ascending: false })

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
            platform: (post.plataform?.toLowerCase() === 'tiktok') ? 'tiktok' : 'instagram'
        }))

        console.log('[getScrapedPosts] Returning reels count:', reels.length)
        return reels
    } catch (error) {
        console.error("[getScrapedPosts] Unexpected error fetching posts:", error)
        return []
    }
}

export async function savePost(clientId: string, post: WebhookReelData) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('posts_salvos')
            .insert({
                client_id: clientId,
                created_at: new Date().toISOString(),
                tipoPost: 'Reel',
                urlPost: post.videoUrl,
                legendaPost: post.caption,
                viewCount: post.viewCount.toString(),
                playCount: post.viewCount.toString(),
                likesCount: post.likeCount,
                commentsCount: post.commentCount,
                scriptUsado: '',
                original_post_id: post.id,
                thumbnailurl: post.displayUrl || post.thumbnailUrl
            })

        if (error) {
            console.error("[savePost] Error saving post:", error)
            throw error
        }

        return { success: true }
    } catch (error) {
        console.error("[savePost] Unexpected error saving post:", error)
        return { success: false, error }
    }
}

export async function removePost(clientId: string, postId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('posts_salvos')
            .delete()
            .eq('client_id', clientId)
            .eq('original_post_id', postId)

        if (error) {
            console.error("[removePost] Error removing post:", error)
            throw error
        }

        return { success: true }
    } catch (error) {
        console.error("[removePost] Unexpected error removing post:", error)
        return { success: false, error }
    }
}

export async function getSavedPostIds(clientId: string): Promise<string[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts_salvos')
            .select('original_post_id')
            .eq('client_id', clientId)

        if (error) {
            console.error("[getSavedPostIds] Error fetching saved posts:", error)
            return []
        }

        return data.map(item => item.original_post_id).filter(Boolean) as string[]
    } catch (error) {
        return []
    }
}

export async function getSavedPosts(clientId: string): Promise<WebhookReelData[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts_salvos')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("[getSavedPosts] Error fetching saved posts:", error)
            return []
        }

        if (!data) return []

        return data.map((post) => ({
            id: post.original_post_id || post.id.toString(),
            username: 'Unknown',
            caption: post.legendaPost || '',
            timestamp: new Date(post.created_at).toISOString(),
            viewCount: parseInt(post.viewCount || '0'),
            likeCount: post.likesCount || 0,
            commentCount: post.commentsCount || 0,
            videoUrl: post.urlPost || '',
            thumbnailUrl: post.thumbnailurl || '',
            displayUrl: post.thumbnailurl || undefined,
            platform: 'instagram' as const
        }))
    } catch (error) {
        console.error("[getSavedPosts] Unexpected error:", error)
        return []
    }
}

export async function saveScript(clientId: string, reel: WebhookReelData, scriptContent: string) {
    const supabase = await createClient()

    try {
        console.log('[saveScript] Saving script for post:', reel.id)

        // Check if post exists in saved posts
        const { data: existingPost } = await supabase
            .from('posts_salvos')
            .select('id')
            .eq('client_id', clientId)
            .eq('original_post_id', reel.id)
            .single()

        if (existingPost) {
            // Update existing post with script
            const { error } = await supabase
                .from('posts_salvos')
                .update({ scriptUsado: scriptContent })
                .eq('id', existingPost.id)

            if (error) throw error
        } else {
            // Insert new post with script
            const { error } = await supabase
                .from('posts_salvos')
                .insert({
                    client_id: clientId,
                    created_at: new Date().toISOString(),
                    tipoPost: 'Reel',
                    urlPost: reel.videoUrl,
                    legendaPost: reel.caption,
                    viewCount: reel.viewCount.toString(),
                    playCount: reel.viewCount.toString(),
                    likesCount: reel.likeCount,
                    commentsCount: reel.commentCount,
                    scriptUsado: scriptContent,
                    original_post_id: reel.id,
                    thumbnailurl: reel.displayUrl || reel.thumbnailUrl
                })

            if (error) throw error
        }

        return { success: true }
    } catch (error) {
        console.error("[saveScript] Error:", error)
        return { success: false, error }
    }
}

export async function removeSavedScript(clientId: string, postId: string) {
    const supabase = await createClient()

    try {
        console.log('[removeSavedScript] Removing script for post:', postId)

        const { error } = await supabase
            .from('posts_salvos')
            .update({ scriptUsado: null })
            .eq('client_id', clientId)
            .eq('original_post_id', postId)

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error("[removeSavedScript] Error:", error)
        return { success: false, error }
    }
}

export async function getSavedScripts(clientId: string): Promise<Record<string, string>> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts_salvos')
            .select('original_post_id, scriptUsado')
            .eq('client_id', clientId)
            .not('scriptUsado', 'is', null)
            .neq('scriptUsado', '')

        if (error) {
            console.error("[getSavedScripts] Error fetching saved scripts:", error)
            return {}
        }

        const scriptMap: Record<string, string> = {}
        data?.forEach(item => {
            if (item.original_post_id && item.scriptUsado) {
                scriptMap[item.original_post_id] = item.scriptUsado
            }
        })

        return scriptMap
    } catch (error) {
        console.error("[getSavedScripts] Unexpected error:", error)
        return {}
    }
}
