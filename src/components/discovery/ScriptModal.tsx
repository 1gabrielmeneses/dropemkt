"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import { Loader2 } from "lucide-react"

interface ScriptModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
    scriptContent?: string
    isScriptSaved?: boolean
    isLoading?: boolean
    onSaveScript?: () => void
    onRemoveScript?: () => void
}

export function ScriptModal({
    isOpen,
    onClose,
    videoUrl,
    scriptContent,
    isLoading = false,
    isScriptSaved = false,
    onSaveScript,
    onRemoveScript
}: ScriptModalProps) {
    if (!videoUrl) return null

    // Ensure we use the embed URL format for Instagram and TikTok
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url)

            // Instagram Embed
            if (urlObj.hostname.includes('instagram.com')) {
                // Remove trailing slash if present and add /embed
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

    // Updated mock script with headers for structure testing
    const defaultScript = `# Análise de Roteiro
**Tom:** Casual, informal, motivacional
**Formato:** Curto (Reel)

# Hook (Gancho Inicial)
"Você não vai acreditar no que aconteceu hoje!"

**Duração:** 5 segundos **Técnica usada:** Problema/Curiosidade **Gatilho mental:** Urgência

**Análise:**
Curiosidade imediata. Explora o gatilho da novidade para prender a atenção nos primeiros segundos.

# Corpo do Vídeo
1. **Cena 1:** Primeiro, eu estava andando pela rua tranquila.
2. **Cena 2:** De repente, vi algo brilhando no chão.
3. **Cena 3:** Quando cheguei perto, percebi que era um mapa antigo.

# Call to Action
Comente "mapa" se você quer saber onde isso vai dar!

# Outras Observações
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`

    // Utility to clean up malformed markdown from AI responses
    const normalizeMarkdown = (text: string) => {
        if (!text) return "";
        let clean = text;

        // 1. Remove wrapping code fences
        const fenceRegex = /^```(?:markdown)?\s*([\s\S]*?)\s*```$/i;
        const match = clean.trim().match(fenceRegex);
        if (match) {
            clean = match[1];
        }

        // 2. Fix indentation issues that cause headers to be treated as code
        const lines = clean.split('\n');
        const processedLines = lines.map(line => {
            const trimmed = line.trim();
            // If a line is a header but indented, trim it
            if (trimmed.startsWith('#')) return trimmed;
            // If a line is a horizontal rule but indented, trim it
            if (trimmed.startsWith('---')) return trimmed;

            // Fix: Split multiple bold fields on the same line
            // Example: "**Field1:** Value **Field2:** Value" -> "**Field1:** Value\n\n**Field2:** Value"
            // We look for occurrences of "**Keys:**" that are NOT at the start of the string
            if (trimmed.includes('**') && trimmed.includes(':')) {
                // This regex looks for bold keys that are embedded in the text
                // It replaces "something **Key:**" with "something\n\n**Key:**"
                return trimmed.replace(/(\s+)(\*\*.+?:\*\*)/g, '\n\n$2');
            }

            return line;
        });
        clean = processedLines.join('\n');

        // 3. Ensure proper spacing before headers
        clean = clean.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

        // 4. Ensure proper spacing before Bold Keys acting as headers
        // Looks for newline followed immediately by **Key:** and makes it double newline
        clean = clean.replace(/\n(\*\*.+?:\*\*)/g, '\n\n$1');

        return clean;
    };

    const displayContent = normalizeMarkdown(String(scriptContent || defaultScript));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-black/95 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm h-[80vh] grid grid-cols-1 md:grid-cols-2">
                {/* Video Section */}
                <div className="h-full w-full bg-black flex items-center justify-center">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full max-w-full max-h-full"
                        frameBorder="0"
                        scrolling="no"
                        // @ts-expect-error - React needs lowercase allowtransparency for DOM, but TS expects camelCase
                        allowtransparency="true"
                        allow="encrypted-media"
                    />
                </div>

                <div className="h-full w-full bg-background p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b-2 border-black/10 pb-4">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Roteiro do Vídeo</DialogTitle>
                    </div>

                    <div className="flex-1 pr-4 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p>Gerando roteiro com IA...</p>
                            </div>
                        ) : (
                            <div className="pb-10 px-1">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ ...props }) => <h1 className="text-xl font-bold text-primary mt-8 mb-4 border-b border-border/50 pb-2 tracking-wide" {...props} />,
                                        h2: ({ ...props }) => <h2 className="text-lg font-semibold text-foreground mt-6 mb-3" {...props} />,
                                        h3: ({ ...props }) => <h3 className="text-base font-semibold text-foreground mt-4 mb-2" {...props} />,
                                        p: ({ ...props }) => <p className="text-base leading-7 text-muted-foreground mb-4" {...props} />,
                                        ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground" {...props} />,
                                        ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground" {...props} />,
                                        li: ({ ...props }) => <li className="pl-1" {...props} />,
                                        strong: ({ ...props }) => <strong className="font-bold text-foreground" {...props} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-muted-foreground bg-muted/20 rounded-r" {...props} />,
                                    }}
                                >
                                    {displayContent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {!isLoading && scriptContent && (
                        <div className="flex justify-end pt-4 border-t border-border/40 mt-auto">
                            <Button
                                onClick={() => isScriptSaved ? onRemoveScript?.() : onSaveScript?.()}
                                variant={isScriptSaved ? "destructive" : "default"}
                                size="sm"
                                className={`border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase font-bold hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isScriptSaved ? "hover:bg-red-600" : ""
                                    }`}
                            >
                                {isScriptSaved ? "Remover Roteiro" : "Salvar Roteiro"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
