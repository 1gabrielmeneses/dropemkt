"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/store/useStore"
import { fetchCompetitorReels, ReelData } from "@/app/actions/apify"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"
import { ReelCard } from "@/components/discovery/ReelCard"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function DiscoveryPage() {
    const { getActiveClient } = useStore()
    const activeClient = getActiveClient()
    const profiles = activeClient?.profiles || []

    const [reels, setReels] = useState<ReelData[]>([])
    const [filteredReels, setFilteredReels] = useState<ReelData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [platform, setPlatform] = useState<string>("all")
    const [matchContext, setMatchContext] = useState(true)

    useEffect(() => {
        async function loadReels() {
            if (!activeClient) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Get all competitor profiles
                const competitors = profiles.filter(p =>
                    p.tags?.includes("Competitor") || p.tags?.includes("AI Discovery")
                )

                if (competitors.length === 0) {
                    setReels([])
                    setFilteredReels([])
                    setLoading(false)
                    return
                }

                // Extract usernames
                const usernames = competitors.map(c => c.handle).filter(Boolean)

                // Fetch reels from Apify
                const fetchedReels = await fetchCompetitorReels(usernames)

                // Filter to last 4 days
                const fourDaysAgo = new Date()
                fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)

                const recentReels = fetchedReels.filter(reel => {
                    const reelDate = new Date(reel.timestamp)
                    return reelDate >= fourDaysAgo
                })

                // Sort by view count descending
                const sortedReels = recentReels.sort((a, b) => b.viewCount - a.viewCount)

                setReels(sortedReels)
                setFilteredReels(sortedReels)
            } catch (error) {
                console.error("Error loading reels:", error)
            } finally {
                setLoading(false)
            }
        }

        loadReels()
    }, [activeClient, profiles])

    // Apply filters
    useEffect(() => {
        let filtered = [...reels]

        // Platform filter
        if (platform !== "all") {
            filtered = filtered.filter(r => r.platform === platform)
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredReels(filtered)
    }, [searchQuery, platform, reels])

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Discovery Engine</h1>
                    <p className="text-muted-foreground">Find viral content in your niche.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Search keywords...</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search keywords..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-[200px] space-y-2">
                        <Label>Platform</Label>
                        <Select value={platform} onValueChange={setPlatform}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Match Context Toggle */}
                {activeClient && (
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg border">
                        <Checkbox
                            id="match-context"
                            checked={matchContext}
                            onCheckedChange={(checked) => setMatchContext(checked as boolean)}
                        />
                        <Label htmlFor="match-context" className="cursor-pointer">
                            Match Client Context: <span className="text-primary font-medium">{activeClient.name}</span>
                        </Label>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="text-center">
                            <p className="font-medium">Buscando conteúdo viral...</p>
                            <p className="text-sm text-muted-foreground">Analisando perfis dos concorrentes</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredReels.length === 0 && (
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
                )}

                {/* Reels Grid */}
                {!loading && filteredReels.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredReels.map((reel) => (
                            <ReelCard key={reel.id} reel={reel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
