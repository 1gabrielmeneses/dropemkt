"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WebhookReelData } from "@/app/actions/webhook"
import { cn, getEmbedUrl } from "@/lib/utils"
import { Play, Heart, MessageCircle } from "lucide-react"
import { TikTokThumbnail } from "@/components/discovery/TikTokThumbnail"

interface ReelCardProps {
    reel: WebhookReelData
    onSave?: (reel: WebhookReelData) => void
    onRemove?: (reel: WebhookReelData) => void
    onPlay?: (url: string) => void
    onOpenScript?: (reel: WebhookReelData) => void
    isSaved?: boolean
    className?: string
}

export function ReelCard({ reel, onSave, onRemove, onPlay, onOpenScript, isSaved = false, className }: ReelCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [showCaptionModal, setShowCaptionModal] = useState(false)

    const formatCount = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const truncateCaption = (text: string, maxLength: number = 80) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    const handleCardClick = () => {
        if (onPlay && reel.videoUrl) {
            onPlay(reel.videoUrl)
        } else if (reel.videoUrl) {
            window.open(reel.videoUrl, '_blank')
        }
    }

    return (
        <>
            <Card
                className={cn(
                    "overflow-hidden cursor-pointer transition-all hover:shadow-lg group bg-card border-border h-full flex flex-col",
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Thumbnail with Play Button */}
                {/* Thumbnail with Video Embed */}
                <div className="relative aspect-[9/16] bg-muted" onClick={handleCardClick}>
                    {reel.videoUrl ? (
                        reel.platform === 'tiktok' ? (
                            <TikTokThumbnail
                                videoUrl={reel.videoUrl}
                                platform={reel.platform}
                                cachedThumbnailUrl={reel.thumbnailUrl || undefined}
                                postId={reel.id}
                                className="w-full h-full"
                                size="card"
                            />
                        ) : (
                            <div className="w-full h-full pointer-events-none overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center transform scale-[1.7]">
                                    <iframe
                                        src={getEmbedUrl(reel.videoUrl)}
                                        className="w-full h-full object-cover"
                                        frameBorder="0"
                                        scrolling="no"
                                        // @ts-expect-error - React needs lowercase allowtransparency for DOM, but TS expects camelCase
                                        allowtransparency="true"
                                        allow="encrypted-media"
                                    />
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <Play className="h-12 w-12 opacity-50" />
                        </div>
                    )}

                    {/* View Count Badge (bottom left) */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                        <Play className="h-3 w-3 text-white fill-white" />
                        <span className="text-white text-xs font-medium">{formatCount(reel.viewCount)}</span>
                    </div>

                    {/* Platform Badge (top left) */}
                    <div className="absolute top-2 left-2">
                        <Badge className={`${reel.platform === 'tiktok' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-pink-600 hover:bg-pink-700'} text-white text-xs border-0`}>
                            {reel.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                        </Badge>
                    </div>
                </div>

                {/* Content Below Image */}
                <div className="p-3 space-y-2 flex flex-col flex-1">
                    {/* Engagement Metrics */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{formatCount(reel.likeCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{formatCount(reel.commentCount)}</span>
                        </div>
                    </div>

                    {/* Caption with "ver mais" */}
                    <div className="space-y-1">
                        <p className="text-sm text-foreground line-clamp-2">
                            {truncateCaption(reel.caption, 80)}
                        </p>
                        {reel.caption.length > 80 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowCaptionModal(true)
                                }}
                                className="text-xs text-primary hover:underline"
                            >
                                ver mais...
                            </button>
                        )}
                    </div>

                    {/* Save/Remove Button & Script Button */}
                    <div className="mt-auto flex gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all bg-white hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (onOpenScript) onOpenScript(reel)
                            }}
                        >
                            Roteiro
                        </Button>
                        <Button
                            size="sm"
                            variant={isSaved ? "destructive" : "default"}
                            className={cn(
                                "flex-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all",
                                isSaved
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-black hover:bg-gray-800 text-white"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (isSaved) {
                                    onRemove?.(reel)
                                } else {
                                    onSave?.(reel)
                                }
                            }}
                        >
                            {isSaved ? "Remover" : "Salvar"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Caption Modal */}
            <Dialog open={showCaptionModal} onOpenChange={setShowCaptionModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Caption</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">{reel.caption}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
