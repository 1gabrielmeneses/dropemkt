
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchCompetitors, CompetitorSearchResult } from "@/app/actions/apify"
import { Loader2, Plus, Check, Search as SearchIcon, ExternalLink, X, ChevronUp, ChevronDown, BadgeCheck } from "lucide-react"
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

    // Initialize with empty string, ignoring defaultQuery for now as requested
    // Initialize with empty string, ignoring defaultQuery for now as requested
    // Initialize with empty string, ignoring defaultQuery for now as requested
    const [query, setQuery] = useState("")
    const [keywords, setKeywords] = useState<string[]>([])
    const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = useState(true)
    const [platform, setPlatform] = useState<'instagram' | 'tiktok'>('instagram')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [results, setResults] = useState<CompetitorSearchResult[]>([])
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

    const handleSearch = async () => {
        // Construct final query from keywords + current input (if any)
        const currentInput = query.trim()
        let activeKeywords = [...keywords]

        if (currentInput && activeKeywords.length < 3) {
            activeKeywords.push(currentInput)
        }

        // Add Brazil context to each keyword and separate by comma
        const searchTerms = activeKeywords.map(k => `${k.trim()} Brasil`).join(", ")

        if (!searchTerms.trim() || activeKeywords.length === 0 && !currentInput) return

        setLoading(true)
        setProgress(5)
        setResults([])

        // Auto-collapse search section
        setIsSearchExpanded(false)

        // Fallback strategy
        const strategy = (activeClient as any)?.content_strategy || []

        // Simulated progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev
                return prev + Math.random() * 10
            })
        }, 800)

        try {
            const data = await searchCompetitors(searchTerms, platform, strategy)

            // Sort by followersCount desc
            const sortedData = [...data]
                .sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));

            setResults(sortedData)
            setProgress(100)

            // Clear current input but keep keywords or clear them? 
            // Usually good to keep context, but let's clear input only
            setQuery("")
        } catch (error) {
            console.error(error)
        } finally {
            clearInterval(progressInterval)
            setLoading(false)
        }
    }

    // Fetch AI suggestions on open
    useEffect(() => {
        async function fetchSuggestions() {
            if (open && activeClient && suggestedKeywords.length === 0) {
                setLoadingSuggestions(true)
                try {
                    const category = (activeClient as any).category
                    const subCategory = (activeClient as any).sub_category
                    const strategy = (activeClient as any).content_strategy || []

                    // Generate 3 specialized keywords using Groq
                    const keywords = await generateSearchKeywords(category || "", subCategory || "", strategy)
                    setSuggestedKeywords(keywords)
                } catch (error) {
                    console.error("Failed to fetch suggestions:", error)
                } finally {
                    setLoadingSuggestions(false)
                }
            }
        }
        fetchSuggestions()
    }, [open, activeClient, suggestedKeywords.length])

    const handleAddSuggestion = (keyword: string) => {
        if (keywords.length >= 3) return
        setKeywords([...keywords, keyword])
        setSuggestedKeywords(prev => prev.filter(k => k !== keyword))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const value = query.trim()

            if (value) {
                if (keywords.length >= 3) {
                    // Prevent adding more than 3
                    return
                }
                setKeywords([...keywords, value])
                setQuery("")
            } else if (e.key === 'Enter') {
                // If empty input and Enter, trigger search
                handleSearch()
            }
        } else if (e.key === 'Backspace' && !query && keywords.length > 0) {
            // Remove last tag if input is empty
            setKeywords(keywords.slice(0, -1))
        }
    }

    const removeKeyword = (indexToRemove: number) => {
        setKeywords(keywords.filter((_, index) => index !== indexToRemove))
    }

    const handleAdd = async (competitor: CompetitorSearchResult) => {
        await addProfile({
            username: competitor.username,
            platform: competitor.platform,
            avatar_url: competitor.avatarUrl,
        })
        setAddedIds(prev => new Set(prev).add(competitor.id))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col transition-all duration-300">
                <DialogHeader className="space-y-1">
                    <DialogTitle>Descobrir Concorrentes com IA</DialogTitle>
                    <div className="flex items-center justify-between">
                        <DialogDescription>
                            Buscamos perfis no Instagram baseados no nicho do seu cliente.
                        </DialogDescription>

                        {!isSearchExpanded && keywords.length > 0 && (
                            <div className="flex gap-1 ml-4 overflow-hidden">
                                {keywords.map((k, i) => (
                                    <Badge key={i} variant="secondary" className="h-5 text-[10px] px-1.5">{k}</Badge>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            className="h-6 w-6 p-0 ml-auto shrink-0 rounded-full hover:bg-muted"
                        >
                            {isSearchExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </DialogHeader>

                {isSearchExpanded && (
                    <div className="py-4 space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                        <Label>Termo de Busca</Label>
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10 pointer-events-none">
                                    <SearchIcon className="h-4 w-4" />
                                </div>

                                {/* Tagged Input Container */}
                                <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full rounded-md border border-input bg-background px-9 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                                    {keywords.map((keyword, index) => (
                                        <Badge key={index} className="gap-1 pr-1 h-7 bg-blue-600 hover:bg-blue-700 text-white animate-in fade-in zoom-in duration-200">
                                            {keyword}
                                            <button
                                                onClick={() => removeKeyword(index)}
                                                className="ml-0.5 hover:bg-blue-800 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Remover</span>
                                            </button>
                                        </Badge>
                                    ))}
                                    <input
                                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                                        placeholder={keywords.length === 0 ? "Ex: Moda Sustentável..." : ""}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={keywords.length >= 3}
                                    />
                                </div>
                            </div>
                            <div className="w-[140px]">
                                <Button
                                    onClick={() => handleSearch()}
                                    disabled={loading || (keywords.length === 0 && !query.trim())}
                                    className="bg-primary text-primary-foreground w-full"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                                </Button>
                            </div>
                        </div>

                        <p className="text-[9px] text-muted-foreground mt-1">
                            Digite e pressione <strong>Enter</strong> para criar uma palavra-chave. Recomendamos usar <strong>2 palavras-chave</strong> (máximo 3).
                        </p>

                        {/* AI Suggestions Area */}
                        {(suggestedKeywords.length > 0 || loadingSuggestions) && (
                            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">IA</span>
                                    Sugestões baseadas no perfil:
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {loadingSuggestions ? (
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                                            ))}
                                        </div>
                                    ) : (
                                        suggestedKeywords.map((keyword, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors border-dashed"
                                                onClick={() => handleAddSuggestion(keyword)}
                                            >
                                                + {keyword}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
                                    <AvatarImage
                                        src={competitor.avatarUrl}
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                        alt={competitor.username}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary">{competitor.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1 pr-2">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div className="font-medium truncate underline-offset-4 flex items-center gap-1">
                                            {competitor.fullName || competitor.username}
                                            {competitor.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />}
                                        </div>
                                        <div className="flex gap-1">
                                            {competitor.followersCount !== undefined && (
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1 shrink-0 whitespace-nowrap">
                                                    {competitor.followersCount > 1000000
                                                        ? `${(competitor.followersCount / 1000000).toFixed(1)}M`
                                                        : competitor.followersCount > 1000
                                                            ? `${(competitor.followersCount / 1000).toFixed(0)}K`
                                                            : competitor.followersCount} seguidores
                                                </Badge>
                                            )}
                                            {competitor.postsCount !== undefined && (
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0 whitespace-nowrap">
                                                    {competitor.postsCount} posts
                                                </Badge>
                                            )}
                                        </div>
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
