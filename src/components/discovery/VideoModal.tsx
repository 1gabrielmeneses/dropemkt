"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

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
            <DialogContent className="w-full max-w-[400px] p-0 overflow-hidden bg-black border-none aspect-[9/16] flex items-center justify-center">
                <DialogTitle className="sr-only">Visualização do Vídeo</DialogTitle>
                <div className="w-full h-full relative">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full absolute inset-0"
                        frameBorder="0"
                        scrolling="no"
                        allowTransparency
                        allow="encrypted-media"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
