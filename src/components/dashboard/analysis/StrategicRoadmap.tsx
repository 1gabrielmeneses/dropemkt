import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategicRecommendations, RecommendationAction } from "@/types/analysis"
import { Calendar, CheckCircle2, Clock, Goal, ArrowRight } from "lucide-react"
import { NoDataState } from "./NoDataState"

interface StrategicRoadmapProps {
    data?: StrategicRecommendations
}

export function StrategicRoadmap({ data }: StrategicRoadmapProps) {
    if (!data || !data.short_term || !data.medium_term || !data.long_term) {
        return <NoDataState message="Roadmap estratégico não disponível." />
    }
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-8">
                <div className="bg-black text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]">
                    <Goal className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">Roadmap Estratégico</h3>
            </div>

            <Tabs defaultValue="short" className="w-full">
                <TabsList className="w-full grid grid-cols-3 h-auto p-2 bg-black border-2 border-black shadow-[8px_8px_0px_0px_rgba(100,100,100,1)] rounded-none gap-2">
                    <TabsTrigger
                        value="short"
                        className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-black text-white font-black uppercase py-3 border-2 border-transparent data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        Curto Prazo
                    </TabsTrigger>
                    <TabsTrigger
                        value="medium"
                        className="data-[state=active]:bg-blue-400 data-[state=active]:text-black data-[state=active]:border-black text-white font-black uppercase py-3 border-2 border-transparent data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        Médio Prazo
                    </TabsTrigger>
                    <TabsTrigger
                        value="long"
                        className="data-[state=active]:bg-green-400 data-[state=active]:text-black data-[state=active]:border-black text-white font-black uppercase py-3 border-2 border-transparent data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        Longo Prazo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="short" className="mt-8 space-y-6">
                    <RoadmapList items={data.short_term} color="yellow" />
                </TabsContent>
                <TabsContent value="medium" className="mt-8 space-y-6">
                    <RoadmapList items={data.medium_term} color="blue" />
                </TabsContent>
                <TabsContent value="long" className="mt-8 space-y-6">
                    <RoadmapList items={data.long_term} color="green" />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function RoadmapList({ items, color }: { items: RecommendationAction[], color: string }) {
    const bgMap: Record<string, string> = {
        yellow: 'bg-yellow-50',
        blue: 'bg-blue-50',
        green: 'bg-green-50'
    }

    const borderMap: Record<string, string> = {
        yellow: 'border-yellow-400',
        blue: 'border-blue-400',
        green: 'border-green-400'
    }

    const iconBgMap: Record<string, string> = {
        yellow: 'bg-yellow-400',
        blue: 'bg-blue-400',
        green: 'bg-green-400'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
                <Card key={i} className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full`}>
                    <CardHeader className={`border-b-2 border-black pb-4 ${bgMap[color]}`}>
                        <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-lg font-black uppercase leading-tight">{item.action}</CardTitle>
                            <Badge className="bg-black text-white border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] whitespace-nowrap">
                                {item.recommendation}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <CheckCircle2 className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="font-bold text-sm uppercase mb-2 border-b-2 border-black w-fit">Execução</p>
                                <ul className="space-y-1">
                                    {item.execution.map((ex, j) => (
                                        <li key={j} className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <ArrowRight className="h-3 w-3 text-black" /> {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={`p-3 border-2 border-black ${bgMap[color]} font-medium text-sm border-dashed relative`}>
                            <span className="font-bold uppercase text-xs block mb-1">Justificativa:</span>
                            <p className="line-clamp-3 text-justify">{item.justification}</p>

                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
