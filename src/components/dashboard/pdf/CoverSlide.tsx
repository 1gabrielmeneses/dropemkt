import { AnalysisProfile } from "@/types/analysis"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CoverSlideProps {
    clientData: AnalysisProfile
}

export function CoverSlide({ clientData }: CoverSlideProps) {
    const {
        basic_profile_info,
        executive_summary,
        niche_and_positioning
    } = clientData

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div
            id="pdf-cover-slide"
            className="w-[1080px] h-[1080px] bg-[#3B82F6] p-16 flex flex-col justify-between text-black relative overflow-hidden font-sans"
            style={{
                fontFamily: 'Inter, sans-serif' // Ensuring font consistency
            }}
        >
            {/* Background Decorations for Neo-Brutalist feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-black transform translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white transform -translate-x-1/2 translate-y-1/2 rounded-full opacity-10 blur-3xl" />

            {/* Header */}
            <div className="flex justify-between items-start z-10">
                <div className="bg-white border-4 border-black px-6 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Relatório de Análise
                    </h1>
                </div>
                <div className="bg-black text-white px-4 py-2 font-bold uppercase transform -rotate-2">
                    CONFIDENCIAL
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center gap-12 z-10">

                {/* Profile Picture Container */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-black translate-x-4 translate-y-4" />
                    <div className="relative bg-white border-4 border-black p-2 w-64 h-64 flex items-center justify-center">
                        <Avatar className="w-full h-full rounded-none border-2 border-black">
                            <AvatarImage
                                src={clientData.logo_url || basic_profile_info?.profile_pic_url}
                                alt={clientData.name}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="text-4xl font-black bg-yellow-400">
                                {clientData.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Client Name & Niche */}
                <div className="text-center space-y-4">
                    <h2 className="text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-none">
                        {clientData.name}
                    </h2>
                    <div className="inline-block bg-yellow-400 border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                        <span className="text-2xl font-bold uppercase tracking-tight">
                            {niche_and_positioning?.primary_niche || basic_profile_info?.category || "Análise de Perfil"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer / Executive Summary Highlights */}
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-10 relative">
                <div className="absolute -top-6 left-8 bg-black text-white px-4 py-1 font-bold uppercase text-sm">
                    Resumo Executivo
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2 border-r-4 border-black pr-8">
                        <span className="text-sm font-bold uppercase text-gray-500">Seguidores</span>
                        <p className="text-4xl font-black truncate">
                            {basic_profile_info?.followers?.toLocaleString('pt-BR') || "0"}
                        </p>
                    </div>

                    <div className="space-y-2 border-r-4 border-black pr-8">
                        <span className="text-sm font-bold uppercase text-gray-500">Engajamento</span>
                        <p className="text-4xl font-black truncate">
                            {basic_profile_info?.engagement_rate || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-bold uppercase text-gray-500">Data da Análise</span>
                        <p className="text-2xl font-bold">
                            {currentDate}
                        </p>
                    </div>
                </div>

                {executive_summary?.description && (
                    <div className="mt-6 pt-6 border-t-4 border-black/10">
                        <p className="text-lg font-medium leading-relaxed line-clamp-2">
                            "{executive_summary.description}"
                        </p>
                    </div>
                )}
            </div>

            {/* Branding Footer */}
            <div className="absolute bottom-4 right-6 text-white/80 font-mono text-sm uppercase tracking-widest">
                Gerado por DropEmkt AI
            </div>
        </div>
    )
}
