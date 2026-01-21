"use client"

import { WebhookReelData } from "@/app/actions/webhook"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageCircle, Play } from "lucide-react"
import { useState } from "react"

interface ReelCardProps {
    reel: WebhookReelData
    onSave?: (reel: WebhookReelData) => void
}

export function ReelCard({ reel, onSave }: ReelCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const formatCount = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const handleCardClick = () => {
        // Open video in new tab or modal
        if (reel.videoUrl) {
            window.open(reel.videoUrl, '_blank')
        }
    }

    return (
        <Card
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] bg-muted">
                <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Platform Badge */}
                <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground capitalize">
                        {reel.platform}
                    </Badge>
                </div>

                {/* Engagement Metrics */}
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                    <div className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">{formatCount(reel.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span className="font-medium">{formatCount(reel.likeCount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">{formatCount(reel.commentCount)}</span>
                        </div>
                    </div>

                    {/* Username and Caption */}
                    <div className="text-white space-y-1">
                        <p className="text-xs font-semibold">@{reel.username}</p>
                        <p className="text-xs line-clamp-2 opacity-90">{reel.caption}</p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="p-3">
                <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(e) => {
                        e.stopPropagation()
                        onSave?.(reel)
                    }}
                >
                    Save for Analysis
                </Button>
            </div>
        </Card>
    )
}
