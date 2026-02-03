"use client"

import { useState, useEffect } from "react"
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
import { CompetitorDiscoveryModal } from "@/components/dashboard/CompetitorDiscoveryModal"
import { getSavedPosts, removePost, getSavedScripts, saveScript, removeSavedScript } from "@/app/actions/discovery"
import { WebhookReelData, triggerScriptWebhook } from "@/app/actions/webhook"
import { ReelCard } from "@/components/discovery/ReelCard"
import { VideoModal } from "@/components/discovery/VideoModal"
import { ScriptModal } from "@/components/discovery/ScriptModal"
import { toast } from "sonner"

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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Resumo do perfil</h1>
                </div>
                <div className="flex gap-2">
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-0 gap-2">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Resumo da conta</TabsTrigger>

                        <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Competidores</TabsTrigger>
                        <TabsTrigger value="analyzed" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Conteúdo analisado</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    <StatsCards />
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[350px]">
                        <div className="lg:col-span-3 h-full">
                            <GrowthChart />
                        </div>
                        <div className="lg:col-span-2 h-full">
                            <ActiveHoursChart />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2 h-full">
                            <DemographicsChart />
                        </div>
                        <div className="lg:col-span-3 h-full">
                            <TopContentList />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="profiles" className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddProfileOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar manual
                        </Button>
                        <Button onClick={() => setDiscoveryOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                            <Users className="mr-2 h-4 w-4" />
                            Descoberta com IA
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activeClient.profiles.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                                <h3 className="text-lg font-medium mb-2">Nenhum competidor adicionado</h3>
                                <p className="mb-4">Adicione competidores para analisar a estratégia deles.</p>
                                <Button onClick={() => setDiscoveryOpen(true)}>Encontrar competidores</Button>
                            </div>
                        ) : (
                            activeClient.profiles.map((profile) => (
                                <ProfileCard
                                    key={profile.id}
                                    id={profile.id}
                                    name={profile.name || ""}
                                    handle={profile.handle}
                                    platform={profile.platform as "instagram" | "tiktok" | "youtube"}
                                    tags={profile.tags || []}
                                    avatarUrl={profile.avatar_url || undefined}
                                    onDelete={handleDeleteProfile}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                <CompetitorDiscoveryModal
                    open={discoveryOpen}
                    onOpenChange={setDiscoveryOpen}
                    defaultQuery={activeClient.brief || activeClient.name}
                />

                <TabsContent value="analyzed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {savedPosts.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground gap-4">
                                <p>Use a aba Discovery para encontrar e analisar conteúdo.</p>
                            </div>
                        ) : (
                            savedPosts.map(post => (
                                <ReelCard
                                    key={post.id}
                                    reel={post}
                                    isSaved={true}
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
                            ))
                        )}
                    </div>
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
