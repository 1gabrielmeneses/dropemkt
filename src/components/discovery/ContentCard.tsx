import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, Download } from "lucide-react"

interface ContentCardProps {
    title: string
    thumbnail: string
    views: string
    likes: string
    platform: "tiktok" | "instagram" | "youtube"
    onSave: () => void
    isSaved?: boolean
}

export function ContentCard({ title, thumbnail, views, likes, platform, onSave, isSaved }: ContentCardProps) {
    return (
        <Card className="overflow-hidden group hover:scale-[1.02] transition-transform duration-300 hover:shadow-lg">
            <div className="relative aspect-[9/16] bg-muted">
                {/* Placeholder for thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl font-bold">
                    {platform === "tiktok" ? "🎵" : platform === "instagram" ? "📸" : "▶️"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-xs font-medium">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {views}
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {likes}
                    </div>
                </div>
            </div>

            <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant={platform === "tiktok" ? "default" : "secondary"} className="text-[10px] px-1.5 h-5 capitalize">
                        {platform}
                    </Badge>
                </div>
                <p className="text-sm line-clamp-2 leading-tight font-medium">
                    {title}
                </p>
            </CardContent>

            <CardFooter className="p-3 pt-0">
                <Button
                    size="sm"
                    className="w-full"
                    variant={isSaved ? "secondary" : "default"}
                    onClick={onSave}
                    disabled={isSaved}
                >
                    {isSaved ? "Saved" : "Save for Analysis"}
                </Button>
            </CardFooter>
        </Card>
    )
}
