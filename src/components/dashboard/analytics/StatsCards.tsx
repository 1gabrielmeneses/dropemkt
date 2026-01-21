"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, User, Play, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

import { useStore } from "@/store/useStore"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"

interface StatCardProps {
    title: string
    value: string | number | undefined | null
    growth?: string
    isPositive?: boolean
    icon: React.ElementType
}

function StatCard({ title, value, growth, isPositive, icon: Icon }: StatCardProps) {
    const hasData = value !== undefined && value !== null;

    return (
        <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    </div>
                </div>

                {!hasData ? (
                    <MissingDataPlaceholder
                        message="No Data"
                        subMessage=""
                        className="min-h-[0px] p-0 h-auto py-2"
                        icon={Icon}
                    />
                ) : (
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{value?.toLocaleString() || 0}</h2>
                            {growth && (
                                <p className={cn(
                                    "text-xs font-medium mt-1 inline-flex items-center",
                                    isPositive ? "text-green-500" : "text-red-500"
                                )}>
                                    {growth} than last week
                                </p>
                            )}
                        </div>
                        {growth && (
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                isPositive ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            )}>
                                {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function StatsCards() {
    const { getActiveClient } = useStore()
    const activeClient = getActiveClient()

    // Using any for now as types might be missing in ClientRow
    // We strictly check for null/undefined to show "Missing Data"
    const followers = (activeClient as any)?.followers_count;
    const views = (activeClient as any)?.views_count;
    const posts = (activeClient as any)?.posts_count;

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <StatCard
                title="Followers"
                value={followers}
                growth={undefined} // Hardcoded growth removed, passed undefined
                icon={User}
            />
            <StatCard
                title="Views"
                value={views}
                growth={undefined} // Hardcoded growth removed
                icon={Play}
            />
            <StatCard
                title="Posts"
                value={posts}
                growth={undefined} // Hardcoded growth removed
                icon={FileText}
            />
        </div>
    )
}
