"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useStore } from "@/store/useStore"
import { getScrapedPosts, savePost, removePost, getSavedPostIds, saveScript, removeSavedScript, getSavedScripts } from "@/app/actions/discovery"
import { WebhookReelData, triggerScriptWebhook, triggerKeywordSearchWebhook } from "@/app/actions/webhook"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, X, SlidersHorizontal, ArrowUpDown, ChevronDown, ChevronUp, Eye, Heart, MessageCircle, RotateCcw } from "lucide-react"
import { VideoModal } from "@/components/discovery/VideoModal"
import { ScriptModal } from "@/components/discovery/ScriptModal"
import { ReelCard } from "@/components/discovery/ReelCard"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function DiscoveryPage() {
    const { getActiveClient } = useStore()
    const activeClient = getActiveClient()

    const [reels, setReels] = useState<WebhookReelData[]>([])
    const [filteredReels, setFilteredReels] = useState<WebhookReelData[]>([])
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
    const [savedScripts, setSavedScripts] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)

    // Tagged input state
    const [searchQuery, setSearchQuery] = useState("")
    const [keywords, setKeywords] = useState<string[]>([])

    const [isSearching, setIsSearching] = useState(false)
    const [platform, setPlatform] = useState<string>("all")
    const [matchContext, setMatchContext] = useState(true)

    // Filter state
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [minViews, setMinViews] = useState<string>("")
    const [minLikes, setMinLikes] = useState<string>("")
    const [minComments, setMinComments] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("recent")
    const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc")

    const [modalOpen, setModalOpen] = useState(false)
    const [scriptModalOpen, setScriptModalOpen] = useState(false)
    const [selectedVideoUrl, setSelectedVideoUrl] = useState("")
    const [selectedScriptVideoUrl, setSelectedScriptVideoUrl] = useState("")
    const [selectedScriptReel, setSelectedScriptReel] = useState<WebhookReelData | null>(null)
    const [scriptContent, setScriptContent] = useState<string>("")
    const [scriptLoading, setScriptLoading] = useState(false)


    const loadReels = useCallback(async () => {
        if (!activeClient) {
            console.log('[DiscoveryPage] No active client')
            setLoading(false)
            return
        }

        console.log('[DiscoveryPage] Loading reels for client:', activeClient.id, activeClient.name)

        try {
            setLoading(true)

            // Fetch reels from Database for the active client
            // Parallel fetch for posts and saved status
            const [fetchedReels, savedIds, savedScriptsMap] = await Promise.all([
                getScrapedPosts(activeClient.id),
                getSavedPostIds(activeClient.id),
                getSavedScripts(activeClient.id)
            ])

            console.log('[DiscoveryPage] Fetched reels:', fetchedReels.length)
            console.log('[DiscoveryPage] Saved IDs:', savedIds)
            console.log('[DiscoveryPage] Saved Scripts:', Object.keys(savedScriptsMap).length)

            setSavedPostIds(new Set(savedIds))
            setSavedScripts(savedScriptsMap)

            // Sort by most recent (already sorted from DB)
            const sortedReels = fetchedReels
            console.log('[DiscoveryPage] Loaded reels:', sortedReels.length)

            setReels(sortedReels)
            setFilteredReels(sortedReels)
        } catch (error) {
            console.error("[DiscoveryPage] Error loading reels:", error)
        } finally {
            setLoading(false)
        }
    }, [activeClient])

    useEffect(() => {
        loadReels()
    }, [loadReels])

    // Count active filters
    const activeFilterCount = [
        minViews, minLikes, minComments
    ].filter(v => v !== "").length + (sortBy !== "recent" ? 1 : 0) + (platform !== "all" ? 1 : 0)

    const clearAllFilters = () => {
        setMinViews("")
        setMinLikes("")
        setMinComments("")
        setSortBy("recent")
        setSortDirection("desc")
        setPlatform("all")
    }

    // Apply filters
    useEffect(() => {
        let filtered = [...reels]

        // Platform filter
        if (platform !== "all") {
            filtered = filtered.filter(r => r.platform === platform)
        }

        // View count filter
        if (minViews) {
            const min = parseInt(minViews)
            if (!isNaN(min)) filtered = filtered.filter(r => r.viewCount >= min)
        }

        // Like count filter
        if (minLikes) {
            const min = parseInt(minLikes)
            if (!isNaN(min)) filtered = filtered.filter(r => r.likeCount >= min)
        }

        // Comment count filter
        if (minComments) {
            const min = parseInt(minComments)
            if (!isNaN(min)) filtered = filtered.filter(r => r.commentCount >= min)
        }

        // Sorting
        filtered.sort((a, b) => {
            let diff = 0
            switch (sortBy) {
                case "views":
                    diff = a.viewCount - b.viewCount
                    break
                case "likes":
                    diff = a.likeCount - b.likeCount
                    break
                case "comments":
                    diff = a.commentCount - b.commentCount
                    break
                case "recent":
                default:
                    diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    break
            }
            return sortDirection === "desc" ? -diff : diff
        })

        setFilteredReels(filtered)
    }, [platform, reels, minViews, minLikes, minComments, sortBy, sortDirection])

    const handleSave = async (reel: WebhookReelData) => {
        if (!activeClient) {
            toast.error("Nenhum cliente selecionado")
            return
        }

        try {
            toast.loading("Salvando post...", { id: "save-post" })
            const result = await savePost(activeClient.id, reel)

            if (result.success) {
                toast.success("Post salvo nos favoritos!", { id: "save-post" })
                setSavedPostIds(prev => new Set(prev).add(reel.id))
            } else {
                toast.error("Erro ao salvar post", { id: "save-post" })
            }
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Erro inesperado ao salvar", { id: "save-post" })
        }
    }

    const handleSearch = async () => {
        // Use keywords state + current input if any
        const currentInput = searchQuery.trim()
        let activeKeywords = [...keywords]

        if (currentInput) {
            activeKeywords.push(currentInput)
        }

        if (activeKeywords.length === 0) return

        setIsSearching(true)
        try {
            if (!activeClient) {
                toast.error("Selecione um cliente para realizar a pesquisa")
                setIsSearching(false)
                return
            }

            // Remove toast loading
            // toast.loading("Buscando novos vídeos no TikTok...", { id: "keyword-search" })

            const result = await triggerKeywordSearchWebhook(activeKeywords, activeClient.id)

            if (result.success) {
                toast.success("Novos vídeos encontrados! Atualizando feed...", { id: "keyword-search" })
                await loadReels() // Refresh data

                // UX Improvement: Clear keywords and search input only on success
                setKeywords([])
                setSearchQuery("")
            } else {
                toast.error("Erro ao realizar pesquisa", { id: "keyword-search" })
            }
        } catch (error) {
            console.error("Search error:", error)
            toast.error("Erro ao realizar pesquisa", { id: "keyword-search" })
        } finally {
            setIsSearching(false)
        }
    }

    const handleRemove = async (reel: WebhookReelData) => {
        if (!activeClient) {
            return
        }

        try {
            toast.loading("Removendo post...", { id: "remove-post" })
            const result = await removePost(activeClient.id, reel.id)

            if (result.success) {
                toast.success("Post removido dos favoritos!", { id: "remove-post" })
                setSavedPostIds(prev => {
                    const next = new Set(prev)
                    next.delete(reel.id)
                    return next
                })
            } else {
                toast.error("Erro ao remover post", { id: "remove-post" })
            }
        } catch (error) {
            console.error("Remove error:", error)
            toast.error("Erro inesperado ao remover", { id: "remove-post" })
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const value = searchQuery.trim()

            if (value) {
                if (keywords.length >= 3) {
                    return
                }
                setKeywords([...keywords, value])
                setSearchQuery("")
            } else if (e.key === 'Enter') {
                // If empty and Enter, trigger search
                handleSearch()
            }
        } else if (e.key === 'Backspace' && !searchQuery && keywords.length > 0) {
            // Remove last tag if input is empty
            setKeywords(keywords.slice(0, -1))
        }
    }

    const removeKeyword = (indexToRemove: number) => {
        setKeywords(keywords.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-primary border-b-4 border-black w-fit pr-10 pb-2">Motor de descoberta</h1>
                <p className="text-lg font-medium text-black/70 mt-2">Encontre conteúdo viral no seu nicho.</p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1 space-y-2 w-full">
                    <Label className="font-bold uppercase">Buscar por palavras-chave...</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <div className="absolute left-3 top-3 h-4 w-4 text-black z-10 pointer-events-none">
                                <Search className="h-4 w-4" />
                            </div>

                            {/* Tagged Input Container */}
                            <div className="flex flex-wrap gap-1.5 min-h-[46px] w-full rounded-sm border-2 border-black bg-white px-9 py-2 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:translate-y-[1px] focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                                {keywords.map((keyword, index) => (
                                    <Badge key={index} className="gap-1 pr-1 h-7 bg-blue-600 hover:bg-blue-700 text-white border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase">
                                        {keyword}
                                        <button
                                            onClick={() => removeKeyword(index)}
                                            className="ml-0.5 hover:bg-blue-800 rounded-sm p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remover</span>
                                        </button>
                                    </Badge>
                                ))}
                                <input
                                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] font-medium"
                                    placeholder={keywords.length === 0 ? "Palavras-chave (ex: marketing, viral)" : ""}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={keywords.length >= 3}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching || (keywords.length === 0 && !searchQuery.trim())}
                            className="bg-black text-white border-2 border-black rounded-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-[46px] px-8"
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pesquisar"}
                        </Button>
                    </div>
                </div>

                <div className="w-full md:w-[200px] space-y-2">
                    <Label className="font-bold uppercase">Plataforma</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase h-[46px] focus:ring-0 focus:ring-offset-0 active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectItem value="all" className="font-medium focus:bg-purple-100 focus:text-black focus:font-bold uppercase cursor-pointer">Todas as plataformas</SelectItem>
                            <SelectItem value="instagram" className="font-medium focus:bg-pink-100 focus:text-pink-600 focus:font-bold uppercase cursor-pointer">Instagram</SelectItem>
                            <SelectItem value="tiktok" className="font-medium focus:bg-purple-100 focus:text-purple-600 focus:font-bold uppercase cursor-pointer">TikTok</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="rounded-sm border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Toggle Header */}
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-black" />
                        <span className="text-sm font-bold uppercase">Filtros avançados</span>
                        {activeFilterCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground h-5 min-w-[20px] flex items-center justify-center text-xs px-1.5 border border-black rounded-sm font-bold">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeFilterCount > 0 && (
                            <span
                                onClick={(e) => { e.stopPropagation(); clearAllFilters() }}
                                className="text-xs text-black font-bold hover:underline cursor-pointer flex items-center gap-1 uppercase"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Limpar
                            </span>
                        )}
                        {filtersOpen ? (
                            <ChevronUp className="h-4 w-4 text-black" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-black" />
                        )}
                    </div>
                </button>

                {/* Filter Content */}
                {filtersOpen && (
                    <div className="px-4 pb-6 pt-4 border-t-2 border-black space-y-6 bg-gray-50/50">
                        {/* Row 1: Sort controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <ArrowUpDown className="h-3 w-3" />
                                    Ordenar por
                                </Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-10 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase bg-white focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <SelectItem value="recent" className="font-bold uppercase focus:bg-purple-100 cursor-pointer">Mais recentes</SelectItem>
                                        <SelectItem value="views" className="font-bold uppercase focus:bg-purple-100 cursor-pointer">Visualizações</SelectItem>
                                        <SelectItem value="likes" className="font-bold uppercase focus:bg-purple-100 cursor-pointer">Curtidas</SelectItem>
                                        <SelectItem value="comments" className="font-bold uppercase focus:bg-purple-100 cursor-pointer">Comentários</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Direção</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 w-full sm:w-auto min-w-[140px] gap-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase bg-white hover:bg-gray-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
                                    onClick={() => setSortDirection(d => d === "desc" ? "asc" : "desc")}
                                >
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                    {sortDirection === "desc" ? "Maior → Menor" : "Menor → Maior"}
                                </Button>
                            </div>
                        </div>

                        {/* Row 2: Minimum filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Views Min */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    Visualizações mínimas
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 10000"
                                    value={minViews}
                                    onChange={(e) => setMinViews(e.target.value)}
                                    className="h-10 text-sm border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium bg-white focus-visible:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-1px] transition-all"
                                />
                            </div>

                            {/* Likes Min */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    Curtidas mínimas
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 1000"
                                    value={minLikes}
                                    onChange={(e) => setMinLikes(e.target.value)}
                                    className="h-10 text-sm border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium bg-white focus-visible:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-1px] transition-all"
                                />
                            </div>

                            {/* Comments Min */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    Comentários mínimos
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 100"
                                    value={minComments}
                                    onChange={(e) => setMinComments(e.target.value)}
                                    className="h-10 text-sm border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium bg-white focus-visible:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[-1px] transition-all"
                                />
                            </div>
                        </div>

                        {/* Results count */}
                        {!loading && reels.length > 0 && (
                            <p className="text-xs font-bold uppercase text-muted-foreground flex justify-end">
                                Mostrando <strong className="text-black mx-1">{filteredReels.length}</strong> de <strong className="text-black mx-1">{reels.length}</strong> vídeos
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Match Context Toggle */}
            {
                activeClient && (
                    <div className="flex items-center space-x-2 p-4 bg-white rounded-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Checkbox
                            id="match-context"
                            checked={matchContext}
                            onCheckedChange={(checked) => setMatchContext(checked as boolean)}
                            className="border-2 border-black h-5 w-5 rounded-sm data-[state=checked]:bg-black data-[state=checked]:text-white"
                        />
                        <Label htmlFor="match-context" className="cursor-pointer font-bold uppercase">
                            Contexto do cliente: <span className="text-primary ml-1">{activeClient.name}</span>
                        </Label>
                    </div>
                )
            }

            {/* Loading State */}
            {
                loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-black" />
                        <div className="text-center">
                            <p className="font-black uppercase text-lg">Buscando conteúdo viral...</p>
                            <p className="text-sm font-medium text-muted-foreground">Analisando perfis dos concorrentes</p>
                        </div>
                    </div>
                )
            }

            {/* Search Loading State */}
            {
                isSearching && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
                            <div className="bg-primary/10 p-4 rounded-full border-2 border-primary">
                                <Search className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black uppercase">Buscando novos vídeos...</h3>
                            <p className="text-sm font-medium text-muted-foreground">
                                Isto pode levar alguns segundos.
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Empty State */}
            {
                !loading && !isSearching && filteredReels.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-black/30 rounded-sm">
                        <div className="text-6xl">🔍</div>
                        <div>
                            <p className="font-black uppercase text-xl">Nenhum conteúdo encontrado</p>
                            <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto mt-2">
                                {reels.length === 0
                                    ? "Adicione concorrentes para começar a descobrir conteúdo viral"
                                    : "Tente ajustar os filtros de busca"}
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Reels Grid */}
            {
                !loading && !isSearching && filteredReels.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredReels.map((reel) => (
                            <ReelCard
                                key={reel.id}
                                reel={reel}
                                onPlay={(url) => {
                                    setSelectedVideoUrl(url)
                                    setModalOpen(true)
                                }}
                                onSave={handleSave}
                                onRemove={handleRemove}
                                isSaved={savedPostIds.has(reel.id)}
                                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px]"
                                onOpenScript={async (reel) => {
                                    setSelectedScriptVideoUrl(reel.videoUrl)
                                    setSelectedScriptReel(reel)
                                    setScriptContent("") // Reset previous content
                                    setScriptModalOpen(true)

                                    // Check if we already have a saved script
                                    if (savedScripts[reel.id]) {
                                        console.log('[DiscoveryPage] Using saved script for:', reel.id)
                                        setScriptContent(savedScripts[reel.id])
                                        return
                                    }

                                    setScriptLoading(true)

                                    try {
                                        const result = await triggerScriptWebhook(reel.id)

                                        if (result.success && result.data) {
                                            console.log('Webhook result data:', result.data)
                                            // Handle different possible response structures
                                            // Handle different possible response structures
                                            let content = ""
                                            const data = result.data

                                            // Helper to extract text from various structures
                                            const extractText = (obj: any): string => {
                                                if (!obj) return ""
                                                if (typeof obj === 'string') return obj

                                                // Handle array (take first item)
                                                if (Array.isArray(obj)) {
                                                    return obj.length > 0 ? extractText(obj[0]) : ""
                                                }

                                                // Handle specific nested structures (e.g. Gemini)
                                                if (obj.content?.parts?.[0]?.text) {
                                                    return obj.content.parts[0].text
                                                }

                                                // Handle common keys
                                                if (obj.output) return extractText(obj.output)
                                                if (obj.script) return extractText(obj.script)
                                                if (obj.text) return extractText(obj.text)
                                                if (obj.content && typeof obj.content === 'string') return obj.content

                                                // Fallback to JSON string
                                                return JSON.stringify(obj, null, 2)
                                            }

                                            content = extractText(data)

                                            setScriptContent(content)
                                            toast.success('Roteiro gerado com sucesso!')
                                        } else {
                                            toast.error('Erro ao gerar roteiro')
                                            setScriptContent("Não foi possível gerar o roteiro. Tente novamente.")
                                        }
                                    } catch (error) {
                                        console.error("Error generating script:", error)
                                        toast.error('Erro ao conectar com o serviço de IA')
                                    } finally {
                                        setScriptLoading(false)
                                    }
                                }}
                            />
                        ))}
                    </div>
                )
            }

            <VideoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                videoUrl={selectedVideoUrl}
            />

            <ScriptModal
                isOpen={scriptModalOpen}
                onClose={() => setScriptModalOpen(false)}
                videoUrl={selectedScriptVideoUrl}
                scriptContent={scriptContent}
                isLoading={scriptLoading}
                isScriptSaved={selectedScriptReel ? !!savedScripts[selectedScriptReel.id] : false}
                onSaveScript={async () => {
                    if (!activeClient || !selectedScriptReel || !scriptContent) return

                    toast.loading("Salvando roteiro...", { id: "save-script" })
                    const result = await saveScript(activeClient.id, selectedScriptReel, scriptContent)

                    if (result.success) {
                        toast.success("Roteiro salvo!", { id: "save-script" })
                        setSavedScripts(prev => ({ ...prev, [selectedScriptReel.id]: scriptContent }))
                        // Also update saved posts IDs since saving a script implicitly saves the post
                        setSavedPostIds(prev => new Set(prev).add(selectedScriptReel.id))
                    } else {
                        toast.error("Erro ao salvar roteiro", { id: "save-script" })
                    }
                }}
                onRemoveScript={async () => {
                    if (!activeClient || !selectedScriptReel) return

                    toast.loading("Removendo roteiro...", { id: "remove-script" })
                    const result = await removeSavedScript(activeClient.id, selectedScriptReel.id)

                    if (result.success) {
                        toast.success("Roteiro removido!", { id: "remove-script" })
                        setSavedScripts(prev => {
                            const next = { ...prev }
                            delete next[selectedScriptReel.id]
                            return next
                        })
                    } else {
                        toast.error("Erro ao remover roteiro", { id: "remove-script" })
                    }
                }}
            />

            {/* Search Loading Overlay Removed */}

        </div >
    )
}
