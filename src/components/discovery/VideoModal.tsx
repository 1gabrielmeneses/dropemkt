"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    if (!videoUrl) return null

    // Ensure we use the embed URL format for Instagram and TikTok
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url)

            // Instagram Embed
            if (urlObj.hostname.includes('instagram.com')) {
                const pathname = urlObj.pathname.replace(/\/$/, '')
                return `${urlObj.origin}${pathname}/embed`
            }

            // TikTok Embed
            if (urlObj.hostname.includes('tiktok.com')) {
                // Extract video ID from path: /@username/video/VIDEO_ID
                const videoIdMatch = urlObj.pathname.match(/video\/(\d+)/)
                if (videoIdMatch && videoIdMatch[1]) {
                    return `https://www.tiktok.com/player/v1/${videoIdMatch[1]}?music_info=1&description=1`
                }
            }

            return url
        } catch (e) {
            return url
        }
    }

    const embedUrl = getEmbedUrl(videoUrl)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full max-w-[400px] p-0 overflow-hidden bg-black border-none aspect-[9/16] flex items-center justify-center">
                <DialogTitle className="sr-only">Visualização do Vídeo</DialogTitle>
                <div className="w-full h-full relative">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full absolute inset-0"
                        frameBorder="0"
                        scrolling="no"
                        // @ts-expect-error - React needs lowercase allowtransparency for DOM, but TS expects camelCase
                        allowtransparency="true"
                        allow="encrypted-media"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
