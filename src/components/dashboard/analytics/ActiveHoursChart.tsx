"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { Clock } from "lucide-react"

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08"] // Simplified for demo
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// Mock intensity data (0-3 scale: 0=none, 1=low, 2=med, 3=high)
const HEATMAP_DATA = [
    [0, 1, 0, 0, 1, 2, 2, 2], // Mon
    [0, 0, 1, 2, 2, 3, 3, 2], // Tue
    [0, 0, 2, 3, 3, 3, 2, 1], // Wed
    [0, 1, 2, 2, 1, 2, 1, 0], // Thu
    [1, 1, 1, 0, 0, 1, 1, 1], // Fri
]

export function ActiveHoursChart() {
    // TODO: Connect to real activity data
    const hasData = false;

    return (
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Active Hours</CardTitle>
                {hasData && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground hidden sm:flex">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary/20 rounded-sm"></span> Low</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary/60 rounded-sm"></span> Med</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-sm"></span> High</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 min-h-[200px]">
                {!hasData ? (
                    <MissingDataPlaceholder
                        message="No Activity Data"
                        subMessage="We haven't tracked enough activity to build a heatmap yet."
                        icon={Clock}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        {DAYS.map((day, dayIndex) => (
                            <div key={day} className="flex items-center gap-4">
                                <span className="w-20 text-xs text-muted-foreground font-medium">{day}</span>
                                <div className="flex-1 grid grid-cols-8 gap-2">
                                    {HOURS.map((_, hourIndex) => {
                                        const intensity = HEATMAP_DATA[dayIndex]?.[hourIndex] || 0
                                        return (
                                            <div
                                                key={`${day}-${hourIndex}`}
                                                className={cn(
                                                    "h-6 w-full rounded-sm transition-colors",
                                                    intensity === 0 && "bg-muted/30",
                                                    intensity === 1 && "bg-primary/20",
                                                    intensity === 2 && "bg-primary/50",
                                                    intensity === 3 && "bg-primary"
                                                )}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="w-20"></span>
                            <div className="flex-1 grid grid-cols-8 gap-2">
                                {HOURS.map(h => (
                                    <span key={h} className="text-[10px] text-muted-foreground text-center">{h}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
