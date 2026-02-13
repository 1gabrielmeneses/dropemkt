import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react"

interface ProfileCardProps {
    id: string;
    handle: string
    name: string
    avatarUrl?: string
    platform: "tiktok" | "instagram" | "youtube"
    tags: string[]
    onDelete?: (id: string) => void
}

export function ProfileCard({ id, handle, name, avatarUrl, platform, tags, onDelete }: ProfileCardProps) {
    return (
        <Card className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden relative flex flex-col">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-black">
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="font-bold border-black">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <div className="font-black text-sm leading-none uppercase">{name}</div>
                        <div className="text-xs font-bold text-muted-foreground">{handle}</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-black hover:text-red-600 hover:bg-black/5"
                            onClick={() => onDelete(id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-black/5">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 capitalize bg-black text-white border-2 border-black rounded-none">
                        {platform}
                    </Badge>
                    {tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-white text-black border-2 border-black rounded-none">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors" asChild>
                    <a href={`https://${platform}.com/${(handle || "").replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        Ver perfil <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
