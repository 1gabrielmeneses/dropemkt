"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    if (!videoUrl) return null

    // Ensure we use the embed URL format for Instagram
    // Transforms https://www.instagram.com/p/ID/ to https://www.instagram.com/p/ID/embed
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url)
            if (urlObj.hostname.includes('instagram.com')) {
                // Remove trailing slash if present and add /embed
                const pathname = urlObj.pathname.replace(/\/$/, '')
                return `${urlObj.origin}${pathname}/embed`
            }
            return url
        } catch (e) {
            return url
        }
    }

    const embedUrl = getEmbedUrl(videoUrl)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black/95 border-none h-[80vh] flex items-center justify-center">
                <iframe
                    src={embedUrl}
                    className="w-full h-full max-w-full max-h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allow="encrypted-media"
                />
            </DialogContent>
        </Dialog>
    )
}
