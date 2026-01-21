"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { TrendingUp } from "lucide-react"

// Mock data preserved for future structure reference
const MOCK_DATA = [
    { day: "April 01", followers: 12000 },
    { day: "April 02", followers: 18000 },
    { day: "April 03", followers: 35000 },
    { day: "April 04", followers: 42000 },
    { day: "April 05", followers: 28000 },
    { day: "April 06", followers: 32000 },
    { day: "April 07", followers: 48000 },
]

export function GrowthChart() {
    // TODO: Connect to real historical data
    const hasData = false;

    return (
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Followers Growth</CardTitle>
                    </div>
                    {/* Only show badge if data exists */}
                    {hasData && (
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
                            25,000
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex-1 min-h-[250px]">
                {!hasData ? (
                    <MissingDataPlaceholder
                        message="No Growth Data"
                        subMessage="We need more time to track your growth metrics."
                        icon={TrendingUp}
                    />
                ) : (
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis
                                    dataKey="day"
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
                                    tickFormatter={(value) => `${value / 1000}K`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
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
