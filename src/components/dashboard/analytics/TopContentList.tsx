"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Heart, MessageCircle, Bookmark, Maximize2, FileVideo, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { TikTokThumbnail } from "@/components/discovery/TikTokThumbnail"

interface TopContentListProps {
    onPlay?: (url: string) => void
    onViewScript?: (item: any) => void
}

export function TopContentList({ onPlay, onViewScript }: TopContentListProps) {
    const { getActiveClient } = useStore()
    const activeClient = getActiveClient()
    const contentList = activeClient?.savedContent || []
    const hasData = contentList.length > 0

    return (
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Conteúdo com melhor desempenho</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 min-h-[200px]">
                {!hasData ? (
                    <MissingDataPlaceholder
                        message="Nenhum conteúdo analisado ainda"
                        subMessage="Salve conteúdo de concorrentes para ver a análise de desempenho aqui."
                        icon={FileVideo}
                    />
                ) : (
                    contentList.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center gap-4 group">
                            {/* Thumbnail */}
                            {item.url ? (
                                <div
                                    className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative group-hover:ring-2 ring-primary/20 transition-all cursor-pointer"
                                    onClick={() => onPlay?.(item.url!)}
                                >
                                    <TikTokThumbnail
                                        videoUrl={item.url}
                                        platform={item.platform || (item.url?.includes('tiktok.com') ? 'tiktok' : 'instagram')}
                                        cachedThumbnailUrl={item.thumbnail_url || undefined}
                                        postId={item.id?.toString()}
                                        className="w-full h-full"
                                        size="small"
                                    />
                                </div>
                            ) : item.thumbnail_url ? (
                                <img
                                    src={item.thumbnail_url}
                                    alt={item.title || "Conteúdo"}
                                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-muted"
                                />
                            ) : (
                                <div className={`h-16 w-16 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center`}>
                                    <FileVideo className="h-6 w-6 text-primary/40" />
                                </div>
                            )}

                            {/* Meta + Stats */}
                            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-12 sm:col-span-4">
                                    <p
                                        className="text-sm font-medium truncate group-hover:text-primary transition-colors cursor-pointer"
                                        title={item.title || ""}
                                        onClick={() => item.url && onPlay?.(item.url)}
                                    >{item.title || "Sem título"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Publicado em {item.published_at ? new Date(item.published_at).toLocaleDateString('pt-BR') : "Data desconhecida"}
                                    </p>
                                </div>

                                <div className="col-span-2 text-center hidden sm:block">
                                    <p className="text-xs text-muted-foreground mb-1">Plataforma</p>
                                    <div className="flex justify-center">
                                        {(() => {
                                            const platform = (item.platform || (item.url?.includes("tiktok.com") ? "tiktok" : "instagram")) as "instagram" | "tiktok"
                                            const isTikTok = platform === 'tiktok'
                                            return (
                                                <div className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${isTikTok
                                                    ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                    : "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
                                                    }`}>
                                                    {platform}
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </div>

                                <div className="col-span-2 text-center hidden sm:block">
                                    <p className="text-xs text-muted-foreground mb-1">Roteiro</p>
                                    <div className="flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onViewScript?.(item)}
                                        >
                                            <FileText className="h-3.5 w-3.5 mr-1" />
                                            Ver
                                        </Button>
                                    </div>
                                </div>

                                <div className="col-span-2 text-center hidden sm:block">
                                    <p className="text-xs text-muted-foreground mb-1">Curtidas</p>
                                    <p className="text-sm font-bold">{(item.likes || 0).toLocaleString()}</p>
                                </div>

                                <div className="col-span-2 text-center hidden sm:block">
                                    <p className="text-xs text-muted-foreground mb-1">Visualizações</p>
                                    <p className="text-sm font-bold">{(item.views || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
