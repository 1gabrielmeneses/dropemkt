"use client"

import { useTikTokThumbnail } from "@/hooks/useTikTokThumbnail"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

interface TikTokThumbnailProps {
    videoUrl: string
    platform: string
    /** Cached thumbnail URL from the database */
    cachedThumbnailUrl?: string
    /** Post ID for saving thumbnails to DB */
    postId?: string
    displayUrl?: string
    className?: string
    onClick?: () => void
    /** Size variant for different use cases */
    size?: "card" | "small"
}

export function TikTokThumbnail({
    videoUrl,
    platform,
    cachedThumbnailUrl,
    postId,
    displayUrl,
    className,
    onClick,
    size = "card"
}: TikTokThumbnailProps) {
    const { thumbnailUrl, loading, error, handleExpired } = useTikTokThumbnail({
        videoUrl,
        platform,
        cachedThumbnailUrl,
        postId,
    })

    // For non-TikTok: use displayUrl if available
    const finalUrl = platform === 'tiktok' ? thumbnailUrl : (displayUrl || null)
    const isSmall = size === "small"

    return (
        <div
            className={cn(
                "relative bg-muted overflow-hidden cursor-pointer group/thumb",
                className
            )}
            onClick={onClick}
        >
            {/* Loading skeleton */}
            {loading && (
                <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
                    <svg
                        viewBox="0 0 48 48"
                        className={cn(
                            "opacity-30",
                            isSmall ? "h-5 w-5" : "h-10 w-10"
                        )}
                        fill="currentColor"
                    >
                        <path d="M38.4 21.68V16c-3.55 0-6.13-1.17-7.93-3.03A12.2 12.2 0 0127.3 8h-5.56v22.4a5.12 5.12 0 01-5.12 4.96 5.12 5.12 0 01-5.12-5.12 5.12 5.12 0 015.12-5.12c.53 0 1.05.08 1.54.22v-5.7a10.82 10.82 0 00-1.54-.11C11.08 19.53 6.8 23.81 6.8 29.36c0 5.55 4.28 9.84 9.82 9.84 5.55 0 10.17-4.29 10.17-9.84V18.52c2.18 1.56 4.87 2.48 7.84 2.48v-0.01c1.32 0 2.58-.2 3.77-.57v1.26z" />
                    </svg>
                </div>
            )}

            {/* Loaded thumbnail */}
            {finalUrl && !loading && (
                <img
                    src={finalUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => {
                        if (platform === 'tiktok') {
                            handleExpired()
                        }
                    }}
                />
            )}

            {/* Error / fallback state */}
            {(error || (!loading && !finalUrl)) && (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <svg
                        viewBox="0 0 48 48"
                        className={cn(
                            "opacity-30",
                            isSmall ? "h-5 w-5" : "h-10 w-10"
                        )}
                        fill="currentColor"
                    >
                        <path d="M38.4 21.68V16c-3.55 0-6.13-1.17-7.93-3.03A12.2 12.2 0 0127.3 8h-5.56v22.4a5.12 5.12 0 01-5.12 4.96 5.12 5.12 0 01-5.12-5.12 5.12 5.12 0 015.12-5.12c.53 0 1.05.08 1.54.22v-5.7a10.82 10.82 0 00-1.54-.11C11.08 19.53 6.8 23.81 6.8 29.36c0 5.55 4.28 9.84 9.82 9.84 5.55 0 10.17-4.29 10.17-9.84V18.52c2.18 1.56 4.87 2.48 7.84 2.48v-0.01c1.32 0 2.58-.2 3.77-.57v1.26z" />
                    </svg>
                </div>
            )}

            {/* Play overlay — shown on hover */}
            {!loading && (
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity",
                    isSmall
                        ? "opacity-0 group-hover/thumb:opacity-100 bg-black/40"
                        : "opacity-0 group-hover/thumb:opacity-100 bg-black/30"
                )}>
                    <div className={cn(
                        "rounded-full bg-white/90 flex items-center justify-center shadow-lg",
                        isSmall ? "h-6 w-6" : "h-12 w-12"
                    )}>
                        <Play className={cn(
                            "text-black fill-black ml-0.5",
                            isSmall ? "h-3 w-3" : "h-5 w-5"
                        )} />
                    </div>
                </div>
            )}
        </div>
    )
}
