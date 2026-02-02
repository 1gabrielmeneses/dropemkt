"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ScriptModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
    scriptContent?: string
}

export function ScriptModal({ isOpen, onClose, videoUrl, scriptContent }: ScriptModalProps) {
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
    const defaultScript = `Este é um roteiro mockado para o vídeo.

**Hook:**
Você não vai acreditar no que aconteceu hoje!

**Corpo:**
1. Primeiro, eu estava andando pela rua tranquila.
2. De repente, vi algo brilhando no chão.
3. Quando cheguei perto, percebi que era um mapa antigo.

**Call to Action:**
Comente "mapa" se você quer saber onde isso vai dar!

-------------------
(Espaço para mais texto mockado para testar o scroll)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-black/95 border-none h-[80vh] grid grid-cols-1 md:grid-cols-2">
                {/* Video Section */}
                <div className="h-full w-full bg-black flex items-center justify-center">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full max-w-full max-h-full"
                        frameBorder="0"
                        scrolling="no"
                        allowTransparency
                        allow="encrypted-media"
                    />
                </div>

                {/* Script Section */}
                <div className="h-full w-full bg-background p-6 flex flex-col overflow-hidden">
                    <DialogTitle className="text-2xl font-bold mb-4">Roteiro do Vídeo</DialogTitle>
                    <div className="flex-1 pr-4 overflow-y-auto">
                        <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {scriptContent || defaultScript}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
