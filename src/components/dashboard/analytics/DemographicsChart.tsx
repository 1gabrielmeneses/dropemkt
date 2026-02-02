"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MissingDataPlaceholder } from "@/components/dashboard/analytics/MissingDataPlaceholder"
import { Users } from "lucide-react"

export function DemographicsChart() {
    // TODO: Connect to real demographics data
    const hasData = false;

    return (
        <Card className="shadow-sm border-border/50 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Demografia</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[200px]">
                {!hasData ? (
                    <MissingDataPlaceholder
                        message="No Demographic Data"
                        subMessage="A demografia aparecerá aqui quando houver dados suficientes do público."
                        icon={Users}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Gender Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="w-12 text-sm text-muted-foreground font-medium">Male</span>
                                <Progress value={75} className="h-2 flex-1" />
                                <span className="w-8 text-sm font-bold text-right">75%</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-12 text-sm text-muted-foreground font-medium">Female</span>
                                <Progress value={25} className="h-2 flex-1" />
                                <span className="w-8 text-sm font-bold text-right">25%</span>
                            </div>
                        </div>

                        <div className="h-px bg-border/50 w-full my-4" />

                        {/* Age Section */}
                        <div className="space-y-1">
                            <p className="text-sm font-semibold mb-3">Age</p>
                            <div className="flex items-center gap-4 py-1">
                                <span className="w-12 text-sm text-muted-foreground font-medium">14-24</span>
                                <Progress value={65} className="h-2 flex-1" />
                                <span className="w-8 text-sm font-bold text-right">65%</span>
                            </div>
                            <div className="flex items-center gap-4 py-1">
                                <span className="w-12 text-sm text-muted-foreground font-medium">25-34</span>
                                <Progress value={95} className="h-2 flex-1" />
                                <span className="w-8 text-sm font-bold text-right">95%</span>
                            </div>
                            <div className="flex items-center gap-4 py-1">
                                <span className="w-12 text-sm text-muted-foreground font-medium">35-44</span>
                                <Progress value={45} className="h-2 flex-1" />
                                <span className="w-8 text-sm font-bold text-right">45%</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
