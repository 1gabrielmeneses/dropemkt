import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContentCategorization, ViralPost } from "@/types/analysis"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts"
import { Video, Zap, TrendingUp, PlayCircle, Star } from "lucide-react"

import { NoDataState } from "./NoDataState"

interface ContentAnalysisProps {
    categorization?: ContentCategorization
    viralPosts?: ViralPost[]
}

const COLORS = ['#FDBA74', '#86EFAC', '#93C5FD', '#FCA5A5', '#D8B4FE'] // Orange, Green, Blue, Red, Purple (Pastel-ish but vibrant)

export function ContentAnalysis({ categorization, viralPosts }: ContentAnalysisProps) {
    if (!categorization || !categorization.themes || !viralPosts) {
        return <NoDataState message="Análise de conteúdo não disponível." />
    }

    const pieData = categorization.themes.map(theme => ({
        name: theme.theme_name,
        value: theme.percentage
    }))

    const barData = categorization.themes.slice(0, 5).map(theme => ({
        name: theme.theme_name.split(' ')[0], // Shorten name
        views: theme.average_views
    }))

    return (
        <div className="space-y-8">

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Theme Distribution */}
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <CardHeader className="border-b-2 border-black bg-orange-200">
                        <CardTitle className="flex items-center gap-2 text-black font-black uppercase">
                            <PieChartIcon className="h-5 w-5" /> Mix de Conteúdo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-6 flex items-center justify-center bg-white">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    stroke="#000"
                                    strokeWidth={2}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px black', borderRadius: '0px', fontWeight: 'bold' }}
                                    itemStyle={{ color: 'black' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Performance by Theme */}
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                    <CardHeader className="border-b-2 border-black bg-blue-200">
                        <CardTitle className="flex items-center gap-2 text-black font-black uppercase">
                            <TrendingUp className="h-5 w-5" /> Performance por Tema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-8 bg-white">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                                    contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px black', borderRadius: '0px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="views" fill="#000" radius={[4, 4, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Static Legend for Charts */}
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
                <div className="flex flex-wrap gap-4 justify-center">
                    {pieData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 border border-black"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-bold uppercase">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Viral Posts Section */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2 border-b-4 border-black pb-2 w-fit pr-8">
                    <Zap className="h-6 w-6 text-yellow-500 fill-black" /> Top Viral Posts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viralPosts.map((post) => (
                        <Card key={post.rank} className="group bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden relative flex flex-col">
                            <div className="absolute top-0 right-0 bg-yellow-400 border-l-2 border-b-2 border-black px-3 py-1 font-black z-10">
                                #{post.rank}
                            </div>

                            <CardHeader className="bg-gray-50 border-b-2 border-black relative overflow-hidden p-4">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-yellow-100 to-transparent pointer-events-none" />
                                <CardTitle className="text-lg font-black leading-tight line-clamp-2 z-10 relative h-12">
                                    {post.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-black text-white border-2 border-black rounded-none text-xs font-bold px-2 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                                        <PlayCircle className="h-3 w-3 mr-1" /> REEL
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-black border-2 border-black rounded-none text-xs font-bold px-2">
                                        {post.category}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 space-y-4 flex-1 flex flex-col">
                                <div className="flex flex-col gap-4 border-b-2 border-black pb-4 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase text-muted-foreground mb-1">
                                            Views
                                        </span>
                                        <span className="text-3xl font-black leading-none">
                                            {post.views.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="w-full">
                                        <span className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                                            Alcance
                                        </span>
                                        <div className="bg-green-100 border-l-4 border-green-500 px-3 py-2 shadow-sm w-full flex items-center gap-2">
                                            <span className="text-xl font-black text-green-800 leading-none">
                                                {post.reach_multiplier.replace(/[^0-9,.]/g, '')}x
                                            </span>
                                            <span className="text-xs font-bold text-green-700 leading-tight uppercase">
                                                a base de seguidores
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-3 border-2 border-black rounded-sm">
                                    <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                        <Star className="h-3 w-3" /> Por que viralizou?
                                    </p>
                                    <p className="text-sm font-medium leading-snug">
                                        {post.why_viral}
                                    </p>
                                </div>

                                {post.lessons_learned && (
                                    <div className="bg-blue-50 p-3 border-2 border-black rounded-sm flex-1">
                                        <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1 text-blue-800">
                                            <Zap className="h-3 w-3" /> Lição Aprendida
                                        </p>
                                        <p className="text-sm font-medium leading-snug text-blue-900">
                                            {post.lessons_learned}
                                        </p>
                                    </div>
                                )}

                                {post.patterns_identified && post.patterns_identified.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-2">
                                        {post.patterns_identified.slice(0, 3).map((pattern, i) => (
                                            <span key={i} className="text-[10px] font-bold uppercase bg-gray-100 border border-black px-1 text-gray-600">
                                                {pattern}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

function PieChartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    )
}
