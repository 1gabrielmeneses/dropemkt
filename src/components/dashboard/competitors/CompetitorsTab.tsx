import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/dashboard/ProfileCard"
import { Plus, Users } from "lucide-react"

interface CompetitorsTabProps {
    profiles: any[]
    onAddManual: () => void
    onDiscovery: () => void
    onDelete: (id: string) => void
}

export function CompetitorsTab({ profiles, onAddManual, onDiscovery, onDelete }: CompetitorsTabProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                        Competidores Monitorados
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onAddManual}
                        className="border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar manual
                    </Button>
                    <Button
                        onClick={onDiscovery}
                        className="bg-purple-600 text-white border-2 border-black font-bold uppercase hover:bg-purple-700 transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Descoberta com IA
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {profiles.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-white border-2 border-dashed border-black rounded-lg">
                        <h3 className="text-lg font-black uppercase mb-2 text-black">Nenhum competidor adicionado</h3>
                        <p className="mb-4 font-medium">Adicione competidores para analisar a estratégia deles.</p>
                        <Button
                            onClick={onDiscovery}
                            className="bg-black text-white border-2 border-black font-bold uppercase hover:bg-gray-800 transition-colors rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                        >
                            Encontrar competidores
                        </Button>
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            id={profile.id}
                            name={profile.username || ""}
                            handle={profile.username || ""}
                            platform={profile.platform as "instagram" | "tiktok" | "youtube"}
                            tags={[]}
                            avatarUrl={profile.avatar_url || undefined}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </section>
    )
}
