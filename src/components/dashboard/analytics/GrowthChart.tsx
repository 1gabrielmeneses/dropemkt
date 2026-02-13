"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { TrendingUp, Loader2 } from "lucide-react"
import { getFollowersGrowth, GrowthDataPoint } from "@/app/actions/analytics"
import { cn } from "@/lib/utils"

interface GrowthChartProps {
    clientId?: string
    className?: string
}

export function GrowthChart({ clientId, className }: GrowthChartProps) {
    const [data, setData] = useState<GrowthDataPoint[]>([])
    const [loading, setLoading] = useState(false)
    const [hasData, setHasData] = useState(false)
    const [currentFollowers, setCurrentFollowers] = useState<number | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!clientId) return

            setLoading(true)
            try {
                const growthData = await getFollowersGrowth(clientId)
                setData(growthData)
                setHasData(growthData.length > 0)

                if (growthData.length > 0) {
                    setCurrentFollowers(growthData[growthData.length - 1].followers)
                }
            } catch (error) {
                console.error("Failed to fetch growth data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [clientId])

    return (
        <Card className={cn("bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm h-full flex flex-col", className)}>
            <CardHeader className="border-b-2 border-black bg-green-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-black" />
                        <CardTitle className="text-black font-black uppercase text-base">Crescimento de seguidores</CardTitle>
                    </div>
                    {/* Only show badge if data exists */}
                    {hasData && currentFollowers !== null && (
                        <div className="bg-black text-white px-3 py-1 font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            {currentFollowers.toLocaleString()}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-4 pt-6 flex-1 min-h-[250px] bg-white">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-black" />
                    </div>
                ) : !hasData ? (
                    <MissingDataPlaceholder
                        message="Sem dados de crescimento"
                        subMessage="Precisamos de mais tempo para acompanhar suas métricas de crescimento."
                        icon={TrendingUp}
                    />
                ) : (
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                                <defs>
                                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000000" opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#000"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                                    tickMargin={10}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#000"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                                    tickMargin={10}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                                        return value
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px black', borderRadius: '0px', fontWeight: 'bold' }}
                                    formatter={(value: number | undefined) => [
                                        value ? value.toLocaleString() : "0",
                                        "Seguidores"
                                    ]}
                                    labelFormatter={(label: string) => `Data: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="followers"
                                    stroke="#000"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFollowers)"
                                    dot={{ fill: "#000", stroke: "#000", strokeWidth: 2, r: 4 }}
                                    activeDot={{ fill: "#000", stroke: "#000", strokeWidth: 2, r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
