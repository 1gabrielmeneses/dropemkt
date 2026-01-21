"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, getDay } from "date-fns"
import { useStore } from "@/store/useStore"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
    const { getActiveClient, activeClientId } = useStore()
    const activeClient = getActiveClient()
    const [currentDate, setCurrentDate] = useState(new Date())

    // Fallback if no client selected
    const savedContent = activeClient?.savedContent || []

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Calculate padding days for the start of the month
    const startDay = getDay(monthStart)
    const paddingDays = Array.from({ length: startDay })

    const nextMonth = () => setCurrentDate(addDays(monthEnd, 1))
    const prevMonth = () => setCurrentDate(addDays(monthStart, -1))

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Editorial Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        {activeClient ? `Plan for: ${activeClient.name}` : "Select a client to plan."}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-card border rounded-md p-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold w-32 text-center select-none">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Visual Calendar Grid */}
                <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="grid grid-cols-7 border-b bg-muted/30">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="bg-muted/5 p-2" />
                        ))}

                        {daysInMonth.map((day) => (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "p-2 hover:bg-muted/30 transition-colors relative group min-h-[100px]",
                                    !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/10",
                                    isSameDay(day, new Date()) && "bg-blue-50/50 dark:bg-blue-900/10"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                    isSameDay(day, new Date()) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {format(day, 'd')}
                                </span>

                                <div className="space-y-1">
                                    {/* Mock Events for specific client dates would go here */}
                                    {/* Keeping static demo events for visual verification only */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar draggable items */}
                <div className="w-80 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col shadow-sm border-dashed">
                        <CardHeader className="pb-3 border-b bg-muted/10">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Unscheduled Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-3 p-4 bg-muted/5">
                            {savedContent.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <p className="text-sm text-muted-foreground">
                                        No content ready.
                                        <br />
                                        Head to Discovery to find ideas.
                                    </p>
                                </div>
                            ) : (
                                savedContent.map(content => (
                                    <div key={content.id} className="group p-3 border rounded-lg bg-card shadow-sm hover:shadow-md transition-all cursor-move flex gap-3 items-start select-none">
                                        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-50 group-hover:opacity-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-2 leading-tight mb-1">{content.title}</p>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                {content.platform} • {content.views} views
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
