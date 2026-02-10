"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchTikTokThumbnail, saveThumbnailToDb } from "@/app/actions/tiktok"

// Global in-memory cache to avoid duplicate oEmbed calls within the same session
const sessionCache = new Map<string, string>()
const pendingRequests = new Map<string, Promise<string | null>>()

interface UseTikTokThumbnailOptions {
    videoUrl: string
    platform: string
    /** Cached thumbnail URL from the database (posts_scaped.displayUrl) */
    cachedThumbnailUrl?: string
    /** Post ID for saving the thumbnail back to the database */
    postId?: string
}

export function useTikTokThumbnail({ videoUrl, platform, cachedThumbnailUrl, postId }: UseTikTokThumbnailOptions) {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(cachedThumbnailUrl || null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    // Fetch thumbnail from oEmbed and optionally save to DB
    const fetchAndCache = useCallback(async () => {
        if (platform !== 'tiktok' || !videoUrl) return null

        // Check session cache first
        const sessionCached = sessionCache.get(videoUrl)
        if (sessionCached) {
            setThumbnailUrl(sessionCached)
            setLoading(false)
            return sessionCached
        }

        setLoading(true)
        setError(false)

        try {
            // Deduplicate concurrent requests
            let request = pendingRequests.get(videoUrl)
            if (!request) {
                request = fetchTikTokThumbnail(videoUrl).then(result => {
                    const url = result?.thumbnailUrl || null
                    if (url) {
                        sessionCache.set(videoUrl, url)
                        // Save to DB in the background (fire-and-forget)
                        if (postId) {
                            saveThumbnailToDb(postId, url).catch(() => { })
                        }
                    }
                    pendingRequests.delete(videoUrl)
                    return url
                })
                pendingRequests.set(videoUrl, request)
            }

            const url = await request
            if (url) {
                setThumbnailUrl(url)
            } else {
                setError(true)
            }
            return url
        } catch {
            setError(true)
            return null
        } finally {
            setLoading(false)
        }
    }, [videoUrl, platform, postId])

    // Called when the <img> fires onError (expired URL)
    const handleExpired = useCallback(() => {
        // Clear the expired URL and re-fetch from oEmbed
        setThumbnailUrl(null)
        // Remove from session cache to force re-fetch
        sessionCache.delete(videoUrl)
        fetchAndCache()
    }, [videoUrl, fetchAndCache])

    useEffect(() => {
        if (platform !== 'tiktok' || !videoUrl) return

        // If we already have a cached URL from the DB, use it directly
        if (cachedThumbnailUrl) {
            setThumbnailUrl(cachedThumbnailUrl)
            // Also populate session cache
            sessionCache.set(videoUrl, cachedThumbnailUrl)
            return
        }

        // No cached URL — fetch from oEmbed
        fetchAndCache()
    }, [videoUrl, platform, cachedThumbnailUrl, fetchAndCache])

    return { thumbnailUrl, loading, error, handleExpired }
}
