import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MoreHorizontal } from "lucide-react"

interface ProfileCardProps {
    handle: string
    name: string
    avatarUrl?: string
    platform: "tiktok" | "instagram" | "youtube"
    tags: string[]
}

export function ProfileCard({ handle, name, avatarUrl, platform, tags }: ProfileCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <div className="font-semibold text-sm leading-none">{name}</div>
                        <div className="text-xs text-muted-foreground">{handle}</div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 capitalize">
                        {platform}
                    </Badge>
                    {tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                    <a href={`https://${platform}.com/${handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        View Profile <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
