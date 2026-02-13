import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AnalysisProfile } from "@/types/analysis"
import { Users, TrendingUp, Video, Play } from "lucide-react"
import { GrowthChart } from "@/components/dashboard/analytics/GrowthChart"

interface AnalysisHeaderProps {
    data?: Partial<AnalysisProfile>
}

export function AnalysisHeader({ data }: AnalysisHeaderProps) {
    // Fallback for basic info if missing (shouldn't happen with correct parent logic, but safe)
    const basicInfo = data?.basic_profile_info || {
        username: "N/A",
        display_name: "Perfil Desconhecido",
        biography: "Sem biografia disponível.",
        followers: 0,
        following: 0,
        posts_count: 0
    }

    const executiveSummary = data?.executive_summary

    return (
        <div className="space-y-8">
            {/* Profile Info - Brutalist Card */}
            <div className="flex flex-col md:flex-row gap-6 items-start bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <AvatarImage src={data?.logo_url || ""} alt={basicInfo.display_name} referrerPolicy="no-referrer" />
                        <AvatarFallback className="bg-yellow-300 text-black font-bold text-2xl border-2 border-black rounded-none">
                            {basicInfo.display_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-4 -right-4 bg-pink-500 border-2 border-black px-3 py-1 text-sm font-black text-white transform rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10">
                        PRO
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <h1 className="text-4xl font-black uppercase tracking-tight text-black decoration-4 underline-offset-4 decoration-yellow-400 underline">
                            {basicInfo.display_name}
                        </h1>
                        <Badge variant="secondary" className="w-fit text-md px-4 py-1.5 border-2 border-black bg-white text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            {basicInfo.username}
                        </Badge>
                    </div>

                    <p className="text-lg font-medium text-black/80 whitespace-pre-wrap max-w-3xl leading-relaxed border-l-4 border-yellow-400 pl-4 bg-yellow-50 p-2">
                        {basicInfo.biography || executiveSummary?.description || "Sem descrição disponível."}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        {[data?.category, data?.sub_category, data?.location].filter(Boolean).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-sm border-2 border-black bg-blue-100 text-black font-bold rounded-none px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Grid - Brutalist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Followers Metric */}
                <Card className="md:col-span-4 bg-yellow-300 border-2 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                        <div className="h-14 w-14 border-2 border-black bg-black text-yellow-300 flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-none">
                            <Users className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Seguidores</p>
                        <h3 className="text-4xl font-black">{basicInfo.followers.toLocaleString()}</h3>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-0.5 -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">TOTAL</span>
                    </CardContent>
                </Card>

                {/* Total Views Metric */}
                <Card className="md:col-span-4 bg-purple-300 border-2 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                        <div className="h-14 w-14 border-2 border-black bg-black text-purple-300 flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-none">
                            <Play className="h-7 w-7 fill-current" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Visualizações</p>
                        <h3 className="text-4xl font-black">{data?.views_count?.toLocaleString() || "N/A"}</h3>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-0.5 rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">TOTAIS</span>
                    </CardContent>
                </Card>

                {/* Reach Rate Metric */}
                <Card className="md:col-span-4 bg-green-300 border-2 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                        <div className="h-14 w-14 border-2 border-black bg-black text-green-300 flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-none">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Taxa de Alcance</p>
                        <h3 className="text-4xl font-black">{executiveSummary?.reach_rate || "N/A"}</h3>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-0.5 rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">VS BASE</span>
                    </CardContent>
                </Card>

                {/* Viral Metric */}
                <Card className="md:col-span-4 bg-pink-300 border-2 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                        <div className="h-14 w-14 border-2 border-black bg-black text-pink-300 flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-none">
                            <Video className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Viralização</p>
                        <h3 className="text-4xl font-black">{executiveSummary?.viral_posts_percentage || "N/A"}</h3>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-0.5 -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">DOS POSTS</span>
                    </CardContent>
                </Card>

                {/* Growth Chart */}
                <div className="md:col-span-8">
                    <GrowthChart
                        clientId={data?.id}
                    />
                </div>
            </div>
        </div>
    )
}
