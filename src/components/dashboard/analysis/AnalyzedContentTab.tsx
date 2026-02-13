import { Button } from "@/components/ui/button"
import { ReelCard } from "@/components/discovery/ReelCard"
import { WebhookReelData } from "@/app/actions/webhook"
import { PlayCircle } from "lucide-react"

interface AnalyzedContentTabProps {
    posts: WebhookReelData[]
    onRemove: (reel: WebhookReelData) => void
    onPlay: (url: string) => void
    onOpenScript: (reel: WebhookReelData) => void
}

export function AnalyzedContentTab({ posts, onRemove, onPlay, onOpenScript }: AnalyzedContentTabProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                    <PlayCircle className="h-8 w-8" />
                    Conteúdo Analisado
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {posts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed border-black rounded-lg text-muted-foreground gap-4 bg-white">
                        <p className="font-bold text-black uppercase">Use a aba Discovery para encontrar e analisar conteúdo.</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <ReelCard
                            key={post.id}
                            reel={post}
                            isSaved={true}
                            onRemove={onRemove}
                            onPlay={onPlay}
                            onOpenScript={onOpenScript}
                            className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                    ))
                )}
            </div>
        </section>
    )
}
