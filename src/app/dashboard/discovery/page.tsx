"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useStore } from "@/store/useStore"
import { getScrapedPosts, savePost, removePost, getSavedPostIds, saveScript, removeSavedScript, getSavedScripts } from "@/app/actions/discovery"
import { WebhookReelData, triggerScriptWebhook, triggerKeywordSearchWebhook } from "@/app/actions/webhook"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, X } from "lucide-react"
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

    // Apply filters
    useEffect(() => {
        let filtered = [...reels]

        // Platform filter
        if (platform !== "all") {
            filtered = filtered.filter(r => r.platform === platform)
        }

        /* 
           Removed local search filtering to prioritize webhook search.
           The search bar now triggers the webhook to find NEW content.
        */

        setFilteredReels(filtered)
    }, [platform, reels])

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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Motor de descoberta</h1>
                <p className="text-muted-foreground">Encontre conteúdo viral no seu nicho.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1 space-y-2 w-full">
                    <Label>Buscar por palavras-chave...</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10 pointer-events-none">
                                <Search className="h-4 w-4" />
                            </div>

                            {/* Tagged Input Container */}
                            <div className="flex flex-wrap gap-1.5 min-h-[40px] w-full rounded-md border border-input bg-background px-9 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                {keywords.map((keyword, index) => (
                                    <Badge key={index} className="gap-1 pr-1 h-7 bg-blue-600 hover:bg-blue-700 text-white">
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
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pesquisar"}
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                        Digite e pressione <strong>Enter</strong> para criar uma palavra-chave. Recomendamos usar no máximo <strong>3 palavras-chave</strong>.
                    </p>
                </div>

                <div className="w-full md:w-[200px] space-y-2">
                    <Label>Plataforma</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as plataformas</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Match Context Toggle */}
            {
                activeClient && (
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg border">
                        <Checkbox
                            id="match-context"
                            checked={matchContext}
                            onCheckedChange={(checked) => setMatchContext(checked as boolean)}
                        />
                        <Label htmlFor="match-context" className="cursor-pointer">
                            Contexto do cliente: <span className="text-primary font-medium">{activeClient.name}</span>
                        </Label>
                    </div>
                )
            }

            {/* Loading State */}
            {
                loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="text-center">
                            <p className="font-medium">Buscando conteúdo viral...</p>
                            <p className="text-sm text-muted-foreground">Analisando perfis dos concorrentes</p>
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
                            <div className="bg-primary/10 p-4 rounded-full">
                                <Search className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Buscando novos vídeos...</h3>
                            <p className="text-sm text-muted-foreground">
                                Isto pode levar alguns segundos.
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Empty State */}
            {
                !loading && !isSearching && filteredReels.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="text-6xl">🔍</div>
                        <div>
                            <p className="font-medium text-lg">Nenhum conteúdo encontrado</p>
                            <p className="text-sm text-muted-foreground">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
