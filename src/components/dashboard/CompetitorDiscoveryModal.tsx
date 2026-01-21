
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchCompetitors, CompetitorSearchResult } from "@/app/actions/apify"
import { Loader2, Plus, Check, Search as SearchIcon, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/store/useStore"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateSearchKeywords } from "@/app/actions/groq"

interface CompetitorDiscoveryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultQuery?: string
}

export function CompetitorDiscoveryModal({ open, onOpenChange, defaultQuery = "" }: CompetitorDiscoveryModalProps) {
    const { addProfile, getActiveClient } = useStore()
    const activeClient = getActiveClient()

    const [query, setQuery] = useState(defaultQuery)
    const [platform, setPlatform] = useState<'instagram' | 'tiktok'>('instagram')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState<CompetitorSearchResult[]>([])
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

    const handleSearch = async (searchQuery?: string, overrideStrategy?: string[]) => {
        const finalQuery = searchQuery || query
        if (!finalQuery) return

        setLoading(true)
        setProgress(5)
        setResults([])

        // Use provided keywords or fallback to client's content strategy
        const strategy = overrideStrategy || (activeClient as any)?.content_strategy || []

        // Simulated progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev
                return prev + Math.random() * 10
            })
        }, 800)

        try {
            const data = await searchCompetitors(finalQuery, platform, strategy)

            // Sort by followersCount desc
            const sortedData = [...data]
                .sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));

            setResults(sortedData)
            setProgress(100)
        } catch (error) {
            console.error(error)
        } finally {
            clearInterval(progressInterval)
            setLoading(false)
        }
    }

    // Auto-search when modal opens if we have client context
    useEffect(() => {
        async function runAutoSearch() {
            if (open && activeClient) {
                const category = (activeClient as any).category
                const subCategory = (activeClient as any).sub_category
                const strategy = (activeClient as any).content_strategy || []

                // Generate 3 specialized keywords using Groq
                const keywords = await generateSearchKeywords(category || "", subCategory || "", strategy)

                const autoQuery = keywords.join(" ") + " Brasil"
                setQuery(autoQuery)

                // Trigger search with the generated keywords
                handleSearch(autoQuery, keywords)
            }
        }
        runAutoSearch()
    }, [open])

    const handleAdd = async (competitor: CompetitorSearchResult) => {
        await addProfile({
            name: competitor.fullName,
            handle: competitor.username,
            platform: competitor.platform,
            avatar_url: competitor.avatarUrl,
            tags: ["Competitor", "AI Discovery"]
        })
        setAddedIds(prev => new Set(prev).add(competitor.id))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Descobrir Concorrentes com IA</DialogTitle>
                    <DialogDescription>
                        Buscamos perfis no {platform === 'instagram' ? 'Instagram' : 'TikTok'} baseados no nicho do seu cliente.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 py-4 items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Termo de Busca</Label>
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ex: Moda Sustentável, Academia..."
                                className="pl-9"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>
                    <div className="w-[140px] space-y-2">
                        <Label>Plataforma</Label>
                        <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => handleSearch()} disabled={loading || !query} className="bg-primary text-primary-foreground">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                    </Button>
                </div>

                {loading && (
                    <div className="space-y-2 pb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Analisando mercado social...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md p-4 space-y-4">
                    {loading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 py-12">
                            <div className="relative">
                                <SearchIcon className="h-12 w-12 text-primary/20" />
                                <Loader2 className="h-12 w-12 animate-spin text-primary absolute inset-0" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-foreground">Aguarde um momento</p>
                                <p className="text-sm">Estamos vasculhando perfis relevantes...</p>
                            </div>
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                            <p>Nenhum resultado encontrado. Tente um termo diferente.</p>
                        </div>
                    )}

                    {results.map((competitor) => (
                        <div key={competitor.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage src={competitor.avatarUrl} referrerPolicy="no-referrer" />
                                    <AvatarFallback className="bg-primary/10 text-primary">{competitor.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1 pr-2">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div className="font-medium truncate underline-offset-4">{competitor.fullName || competitor.username}</div>
                                        {competitor.followersCount && (
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1 shrink-0 whitespace-nowrap">
                                                {competitor.followersCount > 1000000
                                                    ? `${(competitor.followersCount / 1000000).toFixed(1)}M`
                                                    : competitor.followersCount > 1000
                                                        ? `${(competitor.followersCount / 1000).toFixed(0)}K`
                                                        : competitor.followersCount} seguidores
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">@{competitor.username}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2 shrink-0">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                    asChild
                                >
                                    <a href={competitor.profileUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    size="sm"
                                    variant={addedIds.has(competitor.id) ? "secondary" : "outline"}
                                    disabled={addedIds.has(competitor.id)}
                                    onClick={() => handleAdd(competitor)}
                                    className="h-8"
                                >
                                    {addedIds.has(competitor.id) ? (
                                        <>
                                            <Check className="h-4 w-4 mr-1" />
                                            Adicionado
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Adicionar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
