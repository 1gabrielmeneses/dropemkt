"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Heart, MessageCircle, Bookmark, Maximize2, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"

export function TopContentList() {
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
                            {item.thumbnail_url ? (
                                <img src={item.thumbnail_url} alt={item.title || "Conteúdo"} className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-muted" />
                            ) : (
                                <div className={`h-16 w-16 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center`}>
                                    <FileVideo className="h-6 w-6 text-primary/40" />
                                </div>
                            )}

                            {/* Meta + Stats */}
                            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-12 sm:col-span-6">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors cursor-pointer" title={item.title || ""}>{item.title || "Sem título"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Publicado em {item.published_at ? new Date(item.published_at).toLocaleDateString('pt-BR') : "Data desconhecida"}
                                    </p>
                                </div>

                                <div className="col-span-3 text-center hidden sm:block">
                                    <p className="text-xs text-muted-foreground mb-1">Curtidas</p>
                                    <p className="text-sm font-bold">{(item.likes || 0).toLocaleString()}</p>
                                </div>

                                <div className="col-span-3 text-center hidden sm:block">
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
