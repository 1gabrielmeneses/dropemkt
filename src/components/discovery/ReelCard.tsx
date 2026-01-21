"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WebhookReelData } from "@/app/actions/webhook"
import { Play, Heart, MessageCircle } from "lucide-react"

interface ReelCardProps {
    reel: WebhookReelData
    onSave?: (reel: WebhookReelData) => void
    onRemove?: (reel: WebhookReelData) => void
    onPlay?: (url: string) => void
    isSaved?: boolean
}

export function ReelCard({ reel, onSave, onRemove, onPlay, isSaved = false }: ReelCardProps) {
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
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg group bg-card border-border h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Thumbnail with Play Button */}
                <div className="relative aspect-[9/16] bg-muted" onClick={handleCardClick}>
                    {reel.displayUrl || reel.thumbnailUrl ? (
                        <img
                            src={`/api/image-proxy?url=${encodeURIComponent(reel.displayUrl || reel.thumbnailUrl || '')}`}
                            alt="Reel thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('fallback-icon');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <Play className="h-12 w-12 opacity-50" />
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}>
                            <div className="bg-black/40 backdrop-blur-sm rounded-full p-6">
                                <Play className="h-8 w-8 text-white fill-white" />
                            </div>
                        </div>
                    </div>

                    {/* View Count Badge (bottom left) */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                        <Play className="h-3 w-3 text-white fill-white" />
                        <span className="text-white text-xs font-medium">{formatCount(reel.viewCount)}</span>
                    </div>

                    {/* Platform Badge (top left) */}
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-primary/90 text-primary-foreground capitalize text-xs">
                            {reel.platform}
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

                    {/* Save/Remove Button */}
                    <Button
                        size="sm"
                        variant={isSaved ? "destructive" : "default"}
                        className="w-full mt-auto"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (isSaved) {
                                onRemove?.(reel)
                            } else {
                                onSave?.(reel)
                            }
                        }}
                    >
                        {isSaved ? "Remove from Favorites" : "Save for Analysis"}
                    </Button>
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
