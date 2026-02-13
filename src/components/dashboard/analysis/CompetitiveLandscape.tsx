import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CompetitiveLandscape as CompetitiveLandscapeType, SWOTAnalysis } from "@/types/analysis"
import { Swords, TrendingUp, AlertTriangle, ShieldCheck, Zap, Minus } from "lucide-react"
import { NoDataState } from "./NoDataState"

interface CompetitiveLandscapeProps {
    landscape?: CompetitiveLandscapeType
    swot?: SWOTAnalysis
}

export function CompetitiveLandscape({ landscape, swot }: CompetitiveLandscapeProps) {
    if (!landscape || !landscape.direct_competitors || !swot || !swot.strengths || !swot.weaknesses || !swot.opportunities || !swot.threats) {
        return <NoDataState message="Análise competitiva e SWOT não disponíveis." />
    }
    return (
        <div className="space-y-12">

            {/* Competitors Grid */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 border-b-4 border-black pb-2 w-fit pr-8">
                    <Swords className="h-6 w-6 text-red-600" /> Concorrência Direta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {landscape.direct_competitors.map((comp, i) => (
                        <Card key={i} className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <CardHeader className="bg-gray-100 border-b-2 border-black pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">{comp.competitor_name}</CardTitle>
                                    <Badge variant="outline" className="bg-white text-black border-2 border-black rounded-none text-xs font-bold px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {comp.estimated_followers}
                                    </Badge>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">{comp.username}</p>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase mb-1 text-gray-500">Foco</p>
                                        <p className="text-sm font-medium leading-tight">{comp.focus}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase mb-1 text-gray-500">Posicionamento</p>
                                        <p className="text-sm font-medium leading-tight">{comp.positioning}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase mb-1 bg-blue-200 w-fit px-1 border border-black text-black">Diferencial</p>
                                    <p className="text-sm font-medium leading-tight">{comp.differential}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-red-50 p-2 border-2 border-black relative">
                                        <p className="text-[10px] font-black uppercase text-red-600 bg-white border border-black px-1 absolute -top-2 left-2">Ameaça</p>
                                        <p className="text-sm font-bold mt-1 text-red-900 line-clamp-2">{comp.threat_level}</p>

                                    </div>
                                    <div className="bg-green-50 p-2 border-2 border-black relative">
                                        <p className="text-[10px] font-black uppercase text-green-600 bg-white border border-black px-1 absolute -top-2 left-2">Vantagem</p>
                                        <p className="text-sm font-bold mt-1 text-green-900">{comp.pedro_advantages}</p>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SWOT Matrix - Brutalist Edition */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 border-b-4 border-black pb-2 w-fit pr-8">
                    <ShieldCheck className="h-6 w-6 text-blue-600" /> Matriz SWOT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black bg-black">
                    {/* Strengths */}
                    <div className="bg-green-200 p-6 border-b-4 md:border-b-4 md:border-r-4 border-black min-h-[250px] relative group">
                        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-black text-sm uppercase flex items-center gap-2 border-b-2 border-r-2 border-black">
                            <Zap className="h-4 w-4 text-yellow-400" /> Forças
                        </div>
                        <ul className="mt-8 space-y-3">
                            {swot.strengths.map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="font-black text-black text-lg leading-none">+</span>
                                    <span className="text-sm font-bold text-green-900 leading-snug">{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-yellow-200 p-6 border-b-4 border-black min-h-[250px] relative">
                        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-black text-sm uppercase flex items-center gap-2 border-b-2 border-r-2 border-black">
                            <AlertTriangle className="h-4 w-4 text-orange-500" /> Fraquezas
                        </div>
                        <ul className="mt-8 space-y-3">
                            {swot.weaknesses.map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <Minus className="h-4 w-4 text-black shrink-0 mt-0.5" />
                                    <span className="text-sm font-bold text-yellow-900 leading-snug">{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-blue-200 p-6 border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[250px] relative">
                        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-black text-sm uppercase flex items-center gap-2 border-b-2 border-r-2 border-black">
                            <TrendingUp className="h-4 w-4 text-blue-400" /> Oportunidades
                        </div>
                        <ul className="mt-8 space-y-3">
                            {swot.opportunities.map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="font-black text-black text-lg leading-none">↗</span>
                                    <span className="text-sm font-bold text-blue-900 leading-snug">{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Threats */}
                    <div className="bg-red-200 p-6 min-h-[250px] relative">
                        <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-black text-sm uppercase flex items-center gap-2 border-b-2 border-r-2 border-black">
                            <AlertTriangle className="h-4 w-4 text-red-500" /> Ameaças
                        </div>
                        <ul className="mt-8 space-y-3">
                            {swot.threats.map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="font-black text-red-600 text-lg leading-none">!</span>
                                    <span className="text-sm font-bold text-red-900 leading-snug">{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
