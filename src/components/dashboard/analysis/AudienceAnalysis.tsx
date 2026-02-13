import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudienceAnalysis as AudienceAnalysisType } from "@/types/analysis"
import { Briefcase, Heart, MapPin, Target, User, Users, ArrowUpRight, AlertCircle, Lightbulb } from "lucide-react"
import { NoDataState } from "./NoDataState"

interface AudienceAnalysisProps {
    data?: AudienceAnalysisType
}

export function AudienceAnalysis({ data }: AudienceAnalysisProps) {
    if (!data ||
        !data.demographics || !data.demographics.professions ||
        !data.psychographics || !data.psychographics.traits ||
        !data.desires ||
        !data.pain_points) {
        return <NoDataState message="Análise de audiência não disponível." />
    }

    return (
        <div className="space-y-8">

            {/* Top Section: Demographics & Psychographics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Demographics Card (Left - 4 cols) */}
                <Card className="lg:col-span-4 h-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <CardHeader className="pb-4 border-b-2 border-black bg-blue-300">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black uppercase flex items-center gap-2 text-black">
                                <Users className="h-6 w-6 border-2 border-black bg-white p-0.5" />
                                Demografia
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 bg-white">

                        {/* Gender & Age Block */}
                        <div className="bg-gray-100 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 fill-black" />
                                <span className="font-bold text-sm uppercase">Gênero Principal</span>
                            </div>
                            <p className="text-lg font-bold border-b-2 border-black pb-2 mb-3">
                                {data.demographics.gender}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm uppercase flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Faixa Etária
                                </span>
                                <Badge variant="outline" className="text-sm font-black bg-yellow-300 text-black border-2 border-black rounded-none px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    {data.demographics.age_range}
                                </Badge>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 p-4 border-2 border-black bg-pink-100 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest border-b border-black inline-block mb-1">Localização</p>
                                <p className="text-md font-black uppercase">{data.demographics.nationality}</p>
                            </div>
                        </div>

                        {/* Professions */}
                        <div>
                            <p className="text-sm font-bold uppercase flex items-center gap-2 mb-3 border-b-4 border-black w-fit">
                                <Briefcase className="h-4 w-4" /> Profissões Comuns
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {data.demographics.professions.map((prof, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1 text-xs font-bold border-2 border-black bg-white text-black rounded-none hover:bg-black hover:text-white transition-colors cursor-default shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-normal h-auto text-left">
                                        {prof}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Psychographics Card (Right - 8 cols) */}
                <Card className="lg:col-span-8 h-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    <CardHeader className="pb-4 border-b-2 border-black bg-purple-300">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-2 text-black">
                            <Heart className="h-6 w-6 border-2 border-black bg-white p-0.5 fill-red-500" />
                            Psicografia & Comportamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.psychographics.traits.map((trait, i) => (
                                <div key={i} className="group flex gap-3 p-4 border-2 border-black bg-white hover:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                                    <div className="mt-0.5 h-8 w-8 border-2 border-black bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Lightbulb className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold leading-tight">
                                            {trait}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-black text-white border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] text-center">
                            <p className="text-lg font-bold italic font-mono">
                                "Audiência que busca resultados práticos e desconfia de promessas vazias."
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Desires vs Pain Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Desires - Positive/Growth Theme */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 bg-green-300 px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <ArrowUpRight className="h-6 w-6" />
                            Desejos
                        </h3>
                        <Badge className="bg-black text-white border-2 border-black rounded-none text-xs px-3 py-1 font-bold">METAS</Badge>
                    </div>

                    <div className="grid gap-4">
                        {data.desires.map((item, i) => (
                            <Card key={i} className="bg-white border-2 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-8 w-8 border-2 border-black bg-green-400 text-black flex items-center justify-center shrink-0 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {i + 1}
                                    </div>
                                    <p className="text-md font-bold text-black border-l-2 border-black pl-4 group-hover:underline decoration-green-500 decoration-2 underline-offset-2">{item}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Pain Points - Alert/Warning Theme */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 bg-red-400 px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <AlertCircle className="h-6 w-6" />
                            Dores
                        </h3>
                        <Badge className="bg-black text-white border-2 border-black rounded-none text-xs px-3 py-1 font-bold">OBSTÁCULOS</Badge>
                    </div>

                    <div className="grid gap-4">
                        {data.pain_points.map((item, i) => (
                            <Card key={i} className="bg-white border-2 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-8 w-8 border-2 border-black bg-red-500 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        !
                                    </div>
                                    <p className="text-md font-bold text-black border-l-2 border-black pl-4 group-hover:underline decoration-red-500 decoration-2 underline-offset-2">{item}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
