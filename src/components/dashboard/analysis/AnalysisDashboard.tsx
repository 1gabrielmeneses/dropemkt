import { AnalysisProfile } from "@/types/analysis"
import { AnalysisHeader } from "./AnalysisHeader"
import { AudienceAnalysis } from "./AudienceAnalysis"
import { ContentAnalysis } from "./ContentAnalysis"
import { CompetitiveLandscape } from "./CompetitiveLandscape"
import { StrategicRoadmap } from "./StrategicRoadmap"
import { NichePositioning } from "./NichePositioning"
import { CompetitiveMatrix } from "./CompetitiveMatrix"
import { Separator } from "@/components/ui/separator"

export interface AnalysisDashboardProps {
    data?: Partial<AnalysisProfile> | null
    rawClientData?: any
}

export function AnalysisDashboard({ data, rawClientData }: AnalysisDashboardProps) {
    if (rawClientData) {
        return (
            <div className="p-6 bg-white rounded-lg shadow whitespace-pre-wrap font-mono text-sm overflow-auto max-w-full">
                {JSON.stringify(rawClientData, null, 2)}
            </div>
        )
    }

    return (
        <div id="analysis-dashboard-content" className="max-w-7xl mx-auto space-y-16 p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <section id="analysis-header" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AnalysisHeader data={data || undefined} />
            </section>

            <Separator className="bg-black h-1" />

            {/* Audience Section */}
            <section id="audience-analysis" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black uppercase tracking-tight bg-black text-white px-4 py-2 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)]">
                        Análise de Audiência
                    </h2>
                </div>
                <AudienceAnalysis data={data?.audience} />
            </section>

            <Separator className="bg-black h-1" />

            {/* Niche & Positioning Section */}
            <section id="niche-positioning" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black uppercase tracking-tight bg-purple-600 text-white px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Identidade & Posicionamento
                    </h2>
                </div>
                <NichePositioning data={data?.niche_and_positioning} />
            </section>

            <Separator className="bg-black h-1" />

            {/* Content Section */}
            <section id="content-analysis" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black uppercase tracking-tight bg-white text-black border-2 border-black px-4 py-2 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Análise de Conteúdo
                    </h2>
                </div>
                <ContentAnalysis
                    categorization={data?.content_categorization}
                    viralPosts={data?.top_viral_posts}
                />
            </section>

            <Separator className="bg-black h-1" />

            {/* Competition Section */}
            {/* Competition Section */}
            <section id="competitive-analysis" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black uppercase tracking-tight bg-red-600 text-white px-4 py-2 transform -rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Cenário Competitivo
                    </h2>
                </div>
                <CompetitiveLandscape
                    landscape={data?.competitive_landscape}
                    swot={data?.swot_analysis}
                />
                <CompetitiveMatrix data={data?.competitive_landscape} />
            </section>

            <Separator className="bg-black h-1" />

            {/* Strategy Section */}
            <section id="strategic-roadmap" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 pb-12">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black uppercase tracking-tight bg-yellow-400 text-black px-4 py-2 transform rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Plano de Ação
                    </h2>
                </div>
                <StrategicRoadmap data={data?.strategic_recommendations} />
            </section>
        </div>
    )
}
