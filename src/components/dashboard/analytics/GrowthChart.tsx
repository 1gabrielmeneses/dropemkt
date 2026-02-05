"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { TrendingUp, Loader2 } from "lucide-react"
import { getFollowersGrowth, GrowthDataPoint } from "@/app/actions/analytics"

interface GrowthChartProps {
    clientId?: string
}

export function GrowthChart({ clientId }: GrowthChartProps) {
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
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Crescimento de seguidores</CardTitle>
                    </div>
                    {/* Only show badge if data exists */}
                    {hasData && currentFollowers !== null && (
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
                            {currentFollowers.toLocaleString()}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex-1 min-h-[250px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                                        return value
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                    formatter={(value: number | undefined) => [
                                        value ? value.toLocaleString() : "0",
                                        "Seguidores"
                                    ]}
                                    labelFormatter={(label: string) => `Data: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="followers"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFollowers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
