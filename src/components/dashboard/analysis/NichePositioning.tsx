import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NicheAndPositioning } from "@/types/analysis"
import { Fingerprint, Diamond, Palette, Zap, Target, Layers } from "lucide-react"
import { NoDataState } from "./NoDataState"

interface NichePositioningProps {
    data?: NicheAndPositioning
}

export function NichePositioning({ data }: NichePositioningProps) {
    if (!data ||
        !data.value_proposition ||
        !data.value_proposition_breakdown ||
        !data.content_format_and_style ||
        !data.content_format_and_style.tone_and_voice ||
        !data.content_format_and_style.aesthetics ||
        !data.content_format_and_style.editing_style ||
        !data.content_format_and_style.visual_format ||
        !data.positioning_strategy ||
        !data.competitive_differentiation) {
        return <NoDataState message="Análise de nicho e posicionamento não disponível." />
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Niche Identity */}
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <CardHeader className="bg-purple-200 border-b-2 border-black pb-4">
                        <CardTitle className="flex items-center gap-2 text-black font-black uppercase text-xl">
                            <Fingerprint className="h-6 w-6" /> Identidade de Nicho
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nicho Primário</h4>
                            <div className="text-2xl font-black uppercase bg-black text-white p-2 inline-block transform -rotate-1">
                                {data.primary_niche}
                            </div>
                            <p className="text-sm font-medium leading-relaxed border-l-4 border-black pl-3 mt-2">
                                {data.primary_niche_description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sub-nicho</h4>
                            <div className="text-xl font-bold uppercase bg-purple-100 text-purple-900 border-2 border-purple-900 p-1 inline-block transform rotate-1">
                                {data.sub_niche}
                            </div>
                            <p className="text-sm font-medium leading-relaxed border-l-4 border-purple-300 pl-3 mt-2">
                                {data.sub_niche_description}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Value Proposition */}
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <CardHeader className="bg-yellow-200 border-b-2 border-black pb-4">
                        <CardTitle className="flex items-center gap-2 text-black font-black uppercase text-xl">
                            <Diamond className="h-6 w-6" /> Proposta de Valor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="bg-yellow-50 p-4 border-2 border-dashed border-black rounded-sm relative">
                            <Zap className="absolute -top-3 -right-3 h-8 w-8 text-yellow-500 fill-black transform rotate-12" />
                            <p className="text-lg font-bold italic text-center">
                                "{data.value_proposition}"
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b-2 border-gray-100 pb-1">Pilares de Valor</h4>
                            <ul className="grid gap-2">
                                {data.value_proposition_breakdown.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm font-bold">
                                        <div className="mt-1 h-2 w-2 bg-black rotate-45 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Style & Aesthetics */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 border-b-4 border-black pb-2 w-fit pr-8">
                    <Palette className="h-6 w-6 text-pink-500" /> Estilo & Estética
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tone of Voice */}
                    <div className="bg-pink-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                            <div className="h-2 w-2 bg-black rounded-full" /> Tom de Voz
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.content_format_and_style.tone_and_voice.map((tag, i) => (
                                <Badge key={i} className="bg-white text-black border border-black rounded-none shadow-sm hover:bg-black hover:text-white transition-colors whitespace-normal h-auto text-left py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Aesthetics */}
                    <div className="bg-blue-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                            <div className="h-2 w-2 bg-black rounded-full" /> Estética Visual
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.content_format_and_style.aesthetics.map((tag, i) => (
                                <Badge key={i} className="bg-white text-black border border-black rounded-none shadow-sm hover:bg-black hover:text-white transition-colors whitespace-normal h-auto text-left py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Editing Style */}
                    <div className="bg-green-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                            <div className="h-2 w-2 bg-black rounded-full" /> Edição
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.content_format_and_style.editing_style.map((tag, i) => (
                                <Badge key={i} className="bg-white text-black border border-black rounded-none shadow-sm hover:bg-black hover:text-white transition-colors whitespace-normal h-auto text-left py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Formats */}
                    <div className="bg-orange-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                            <div className="h-2 w-2 bg-black rounded-full" /> Formatos
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.content_format_and_style.visual_format.map((tag, i) => (
                                <Badge key={i} className="bg-white text-black border border-black rounded-none shadow-sm hover:bg-black hover:text-white transition-colors whitespace-normal h-auto text-left py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategy & Differentiation */}
            <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(100,100,100,1)] rounded-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Positioning Strategy */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 text-yellow-400">
                            <Target className="h-5 w-5" /> Estratégia de Posicionamento
                        </h3>
                        <div className="space-y-4">
                            {data.positioning_strategy.map((strat, i) => (
                                <div key={i} className="bg-zinc-900 border border-zinc-700 p-4 relative overflow-hidden group hover:border-yellow-400 transition-colors">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-bl-full -mr-8 -mt-8" />
                                    <h4 className="font-bold text-lg mb-2 text-white">{strat.strategy}</h4>
                                    <p className="text-sm text-gray-400 mb-3">{strat.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {strat.examples.map((ex, j) => (
                                            <span key={j} className="text-xs bg-black border border-zinc-700 px-2 py-1 text-gray-300 font-mono">
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Competitive Differentiation */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase flex items-center gap-2 text-green-400">
                            <Layers className="h-5 w-5" /> Diferenciais Competitivos
                        </h3>
                        <ul className="space-y-3">
                            {data.competitive_differentiation.map((diff, i) => (
                                <li key={i} className="flex gap-4 items-start p-3 bg-zinc-900 border-l-4 border-green-500 hover:bg-zinc-800 transition-colors">
                                    <span className="font-black text-green-500 text-lg">0{i + 1}</span>
                                    <span className="font-medium text-gray-200">{diff}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
