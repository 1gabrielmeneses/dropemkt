"use client"

import { useState, useEffect } from "react"
import { AnalysisProfile } from "@/types/analysis"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, Users } from "lucide-react"
import { ProfileCard } from "@/components/dashboard/ProfileCard"
import { useStore } from "@/store/useStore"
import { AddProfileDialog } from "@/components/dashboard/AddProfileDialog"
import { StatsCards } from "@/components/dashboard/analytics/StatsCards"
import { GrowthChart } from "@/components/dashboard/analytics/GrowthChart"
import { DemographicsChart } from "@/components/dashboard/analytics/DemographicsChart"
import { ActiveHoursChart } from "@/components/dashboard/analytics/ActiveHoursChart"
import { TopContentList } from "@/components/dashboard/analytics/TopContentList"
import { EngagementMetrics } from "@/components/dashboard/analytics/EngagementMetrics"
import { CompetitorDiscoveryModal } from "@/components/dashboard/CompetitorDiscoveryModal"
import { getSavedPosts, removePost, getSavedScripts, saveScript, removeSavedScript } from "@/app/actions/discovery"
import { WebhookReelData, triggerScriptWebhook } from "@/app/actions/webhook"
import { ReelCard } from "@/components/discovery/ReelCard"
import { VideoModal } from "@/components/discovery/VideoModal"
import { ScriptModal } from "@/components/discovery/ScriptModal"
import { toast } from "sonner"
import { AnalysisDashboard } from "@/components/dashboard/analysis/AnalysisDashboard"
import { CompetitorsTab } from "@/components/dashboard/competitors/CompetitorsTab"
import { AnalyzedContentTab } from "@/components/dashboard/analysis/AnalyzedContentTab"


export default function DashboardPage() {
    const { getActiveClient, removeProfile } = useStore()
    const activeClient = getActiveClient()
    const [addProfileOpen, setAddProfileOpen] = useState(false)
    const [discoveryOpen, setDiscoveryOpen] = useState(false)

    // Saved Posts State
    const [savedPosts, setSavedPosts] = useState<WebhookReelData[]>([])
    const [videoModalOpen, setVideoModalOpen] = useState(false)
    const [selectedVideoUrl, setSelectedVideoUrl] = useState("")

    // Script State
    const [savedScripts, setSavedScripts] = useState<Record<string, string>>({})
    const [scriptModalOpen, setScriptModalOpen] = useState(false)
    const [selectedScriptVideoUrl, setSelectedScriptVideoUrl] = useState("")
    const [selectedScriptReel, setSelectedScriptReel] = useState<WebhookReelData | null>(null)
    const [scriptContent, setScriptContent] = useState<string>("")
    const [scriptLoading, setScriptLoading] = useState(false)

    useEffect(() => {
        if (activeClient) {
            Promise.all([
                getSavedPosts(activeClient.id),
                getSavedScripts(activeClient.id)
            ]).then(([posts, scripts]) => {
                setSavedPosts(posts)
                setSavedScripts(scripts)
            })
        }
    }, [activeClient])

    const handleRemoveSaved = async (reel: WebhookReelData) => {
        if (!activeClient) return

        try {
            toast.loading("Removendo post...", { id: "remove-saved" })
            const result = await removePost(activeClient.id, reel.id)

            if (result.success) {
                toast.success("Post removido!", { id: "remove-saved" })
                setSavedPosts(prev => prev.filter(p => p.id !== reel.id))
            } else {
                toast.error("Erro ao remover post", { id: "remove-saved" })
            }
        } catch (error) {
            toast.error("Erro inesperado", { id: "remove-saved" })
        }
    }


    const handleDeleteProfile = async (id: string) => {
        if (!activeClient) return
        try {
            toast.loading("Removendo competidor...", { id: "remove-profile" })
            await removeProfile(id)
            toast.success("Competidor removido!", { id: "remove-profile" })
        } catch (error) {
            toast.error("Erro ao remover competidor", { id: "remove-profile" })
        }
    }

    if (!activeClient) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Nenhum projeto ativo</h2>
                    <p className="text-muted-foreground">Selecione ou crie um projeto na barra lateral.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AddProfileDialog open={addProfileOpen} onOpenChange={setAddProfileOpen} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-primary border-b-4 border-black w-fit pr-10 pb-2">DASHBOARD DO PERFIL</h1>
                </div>
                <div className="flex gap-2">
                </div>
            </div>

            <Tabs defaultValue="analysis" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-0 gap-4">
                        <TabsTrigger value="analysis" className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-sm font-bold uppercase transition-all bg-white text-black hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6">Análise Detalhada</TabsTrigger>
                        {/* <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Resumo da conta</TabsTrigger> */}

                        <TabsTrigger value="profiles" className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-sm font-bold uppercase transition-all bg-white text-black hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6">Competidores</TabsTrigger>
                        <TabsTrigger value="analyzed" className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-sm font-bold uppercase transition-all bg-white text-black hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6">Conteúdo analisado</TabsTrigger>
                        {/* <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Análise Detalhada</TabsTrigger> */}
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-10">
                    <div className="mb-14">
                        <StatsCards />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[350px] mb-14">
                        <div className="lg:col-span-3 h-full">
                            <GrowthChart clientId={activeClient?.id} />
                        </div>
                        <div className="lg:col-span-2 h-full">
                            <EngagementMetrics
                                avgLikes={activeClient.avg_like}
                                avgComments={activeClient.avg_comments}
                                avgViews={activeClient.avg_views}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <TopContentList
                            onPlay={(url) => {
                                setSelectedVideoUrl(url)
                                setVideoModalOpen(true)
                            }}
                            onViewScript={async (item) => {
                                // Adapt item to reel-like structure for the shared logic if needed, 
                                // but simpler to just use item fields directly
                                setSelectedScriptVideoUrl(item.url || "")
                                // We need a 'reel' object for saving scripts potentially. 
                                // TopContentList items might differ from 'savedPosts'. 
                                // Construct a compatible object or fetch if needed.
                                // For now, let's construct a minimal reel object.
                                const reel = {
                                    id: item.id,
                                    videoUrl: item.url || "",
                                    // other fields might be needed by saveScript... 
                                    // looking at saveScript usage: saveScript(activeClient.id, selectedScriptReel, scriptContent)
                                    // It likely needs more than just id and videoUrl. 
                                    // However, for viewing, this is enough. 
                                    // If 'item' is fully populated, we can pass it casted.
                                    ...item
                                }
                                setSelectedScriptReel(reel)
                                setScriptContent("")
                                setScriptModalOpen(true)

                                if (savedScripts[item.id]) {
                                    setScriptContent(savedScripts[item.id])
                                    return
                                }

                                setScriptLoading(true)

                                try {
                                    const result = await triggerScriptWebhook(item.id)

                                    if (result.success && result.data) {
                                        let content = ""
                                        const data = result.data

                                        const extractText = (obj: any): string => {
                                            if (!obj) return ""
                                            if (typeof obj === 'string') return obj
                                            if (Array.isArray(obj)) return obj.length > 0 ? extractText(obj[0]) : ""
                                            if (obj.content?.parts?.[0]?.text) return obj.content.parts[0].text
                                            if (obj.output) return extractText(obj.output)
                                            if (obj.script) return extractText(obj.script)
                                            if (obj.text) return extractText(obj.text)
                                            if (obj.content && typeof obj.content === 'string') return obj.content
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
                                    toast.error('Erro ao conectar com o serviço de IA')
                                } finally {
                                    setScriptLoading(false)
                                }
                            }}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="profiles" className="space-y-10">
                    <CompetitorsTab
                        profiles={activeClient.profiles}
                        onAddManual={() => setAddProfileOpen(true)}
                        onDiscovery={() => setDiscoveryOpen(true)}
                        onDelete={handleDeleteProfile}
                    />
                </TabsContent>

                <CompetitorDiscoveryModal
                    open={discoveryOpen}
                    onOpenChange={setDiscoveryOpen}
                    defaultQuery={activeClient.brief || activeClient.name || undefined}
                />

                <TabsContent value="analyzed">
                    <AnalyzedContentTab
                        posts={savedPosts}
                        onRemove={handleRemoveSaved}
                        onPlay={(url) => {
                            setSelectedVideoUrl(url)
                            setVideoModalOpen(true)
                        }}
                        onOpenScript={async (reel) => {
                            setSelectedScriptVideoUrl(reel.videoUrl)
                            setSelectedScriptReel(reel)
                            setScriptContent("")
                            setScriptModalOpen(true)

                            if (savedScripts[reel.id]) {
                                setScriptContent(savedScripts[reel.id])
                                return
                            }

                            setScriptLoading(true)

                            try {
                                const result = await triggerScriptWebhook(reel.id)

                                if (result.success && result.data) {
                                    let content = ""
                                    const data = result.data

                                    const extractText = (obj: any): string => {
                                        if (!obj) return ""
                                        if (typeof obj === 'string') return obj
                                        if (Array.isArray(obj)) return obj.length > 0 ? extractText(obj[0]) : ""
                                        if (obj.content?.parts?.[0]?.text) return obj.content.parts[0].text
                                        if (obj.output) return extractText(obj.output)
                                        if (obj.script) return extractText(obj.script)
                                        if (obj.text) return extractText(obj.text)
                                        if (obj.content && typeof obj.content === 'string') return obj.content
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
                                toast.error('Erro ao conectar com o serviço de IA')
                            } finally {
                                setScriptLoading(false)
                            }
                        }}
                    />
                </TabsContent>
                <TabsContent value="analysis">
                    {(() => {
                        const basicInfo = {
                            username: activeClient.instagram_username || "@perfil",
                            display_name: activeClient.name || "Perfil",
                            biography: activeClient.niche_description || activeClient.brief || "Sem biografia disponível.",
                            followers: activeClient.followers_count || 0,
                            following: 0,
                            total_posts: activeClient.posts_count || 0,
                            engagement_rate: "N/A",
                            category: "Geral",
                            account_type: "Business",
                            external_link: "",
                            story_highlights: {
                                analysis: "N/A",
                                total_count: 0
                            },
                            biography_analysis: "N/A",
                            relevant_connections: {
                                analysis: "N/A",
                                followed_by: "N/A"
                            }
                        }



                        // Filter out relationship data to only show client table columns
                        const { profiles, savedContent, calendarEvents, apiTokens, ...clientData } = activeClient

                        // Cast clientData to include missing JSON columns that are not in the Supabase types yet
                        const fullClientData = clientData as any

                        const analysisData: AnalysisProfile = {
                            ...fullClientData,
                            basic_profile_info: basicInfo,
                            // Ensure nested objects are present to avoid crashes if DB data is missing
                            audience: fullClientData.audience || { desires: [], pain_points: [], demographics: {}, psychographics: {} },
                            niche_and_positioning: fullClientData.niche_and_positioning,
                            content_categorization: fullClientData.content_categorization,
                            top_viral_posts: fullClientData.top_viral_posts || [],
                            competitive_landscape: fullClientData.competitive_landscape,
                            swot_analysis: fullClientData.swot_analysis,
                            strategic_recommendations: fullClientData.strategic_recommendations,
                            executive_summary: fullClientData.executive_summary
                        }

                        return <AnalysisDashboard data={analysisData} />
                    })()}
                </TabsContent>


            </Tabs>

            <VideoModal
                isOpen={videoModalOpen}
                onClose={() => setVideoModalOpen(false)}
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
        </div>
    )
}
