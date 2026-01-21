"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, Users } from "lucide-react"
import { ProfileCard } from "@/components/dashboard/ProfileCard"
import { useStore } from "@/store/useStore"
import { AddProfileDialog } from "@/components/dashboard/AddProfileDialog"
import { StatsCards } from "@/components/dashboard/analytics/StatsCards"
import { GrowthChart } from "@/components/dashboard/analytics/GrowthChart"
import { DemographicsChart } from "@/components/dashboard/analytics/DemographicsChart"
import { ActiveHoursChart } from "@/components/dashboard/analytics/ActiveHoursChart"
import { TopContentList } from "@/components/dashboard/analytics/TopContentList"
import { CompetitorDiscoveryModal } from "@/components/dashboard/CompetitorDiscoveryModal"

export default function DashboardPage() {
    const { getActiveClient } = useStore()
    const activeClient = getActiveClient()
    const [addProfileOpen, setAddProfileOpen] = useState(false)
    const [discoveryOpen, setDiscoveryOpen] = useState(false)

    if (!activeClient) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">No Active Project</h2>
                    <p className="text-muted-foreground">Select or create a project from the sidebar.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AddProfileDialog open={addProfileOpen} onOpenChange={setAddProfileOpen} />

            <div className="flex items-center justify-between">
                <div>
                    {/* Header is cleaner as per reference, arguably Title is "Profile Summary" inside the content area but we keep Page Title */}
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Summary</h1>
                </div>
                <div className="flex gap-2">
                    {/* Reference has icons like 'Question', 'Settings'. Keeping our main actions but styling implies a clean top bar */}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-0 gap-2">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Account Summary</TabsTrigger>
                        <TabsTrigger value="report" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Report</TabsTrigger> {/* Visual Placeholder */}
                        <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Competitors</TabsTrigger>
                        <TabsTrigger value="analyzed" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background">Analyzed Content</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    {/* 1. Top Stats Row */}
                    <StatsCards />

                    {/* 2. Middle Row: Growth & Active Hours */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[350px]">
                        <div className="lg:col-span-3 h-full">
                            <GrowthChart />
                        </div>
                        <div className="lg:col-span-2 h-full">
                            <ActiveHoursChart />
                        </div>
                    </div>

                    {/* 3. Bottom Row: Demographics & Top Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2 h-full">
                            <DemographicsChart />
                        </div>
                        <div className="lg:col-span-3 h-full">
                            <TopContentList />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="profiles" className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddProfileOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Manual Add
                        </Button>
                        <Button onClick={() => setDiscoveryOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                            <Users className="mr-2 h-4 w-4" />
                            AI Discovery
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activeClient.profiles.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                                <h3 className="text-lg font-medium mb-2">No competitors tracked</h3>
                                <p className="mb-4">Start by adding competitors to analyze their strategy.</p>
                                <Button onClick={() => setDiscoveryOpen(true)}>Find Competitors</Button>
                            </div>
                        ) : (
                            activeClient.profiles.map((profile) => (
                                <ProfileCard
                                    key={profile.id}
                                    name={profile.name}
                                    handle={profile.handle}
                                    platform={profile.platform as "instagram" | "tiktok" | "youtube"}
                                    tags={profile.tags}
                                    avatarUrl={profile.avatar_url || undefined} // Fixed to match profile card prop if needed, or update interface
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                <CompetitorDiscoveryModal
                    open={discoveryOpen}
                    onOpenChange={setDiscoveryOpen}
                    defaultQuery={activeClient.brief || activeClient.name}
                />

                <TabsContent value="analyzed">
                    <div className="grid gap-4 md:grid-cols-3">
                        {activeClient.savedContent.length === 0 ? (
                            <div className="col-span-full flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                                Use the Discovery tab to find and analyze content.
                            </div>
                        ) : (
                            activeClient.savedContent.map(content => (
                                <div key={content.id} className="border p-4 rounded bg-card">
                                    <h3 className="font-semibold truncate">{content.title}</h3>
                                    <p className="text-xs text-muted-foreground">{content.platform} • {content.views} views</p>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="report">
                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                        Report generation module coming soon.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
