"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageCircle, Eye, TrendingUp } from "lucide-react"

interface EngagementMetricsProps {
    avgLikes?: number | null
    avgComments?: number | null
    avgViews?: number | null
}

export function EngagementMetrics({ avgLikes, avgComments, avgViews }: EngagementMetricsProps) {
    // Helper to format numbers compactly (1.2k, 1M, etc)
    const formatNumber = (num: number | null | undefined) => {
        if (!num) return "0"
        return new Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(num)
    }

    const metrics = [
        {
            label: "Média de Likes",
            value: formatNumber(avgLikes),
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            label: "Média de Comentários",
            value: formatNumber(avgComments),
            icon: MessageCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Média de Visualizações",
            value: formatNumber(avgViews),
            icon: Eye,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ]

    return (
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Engajamento Médio
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 p-6 pt-2">
                {metrics.map((metric, index) => (
                    <div key={index} className="flex-1 flex items-center justify-between px-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors border border-border/50">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${metric.bg} ${metric.color} bg-opacity-15 ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
                                <metric.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
