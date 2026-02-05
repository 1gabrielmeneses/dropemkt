"use server"

import { createClient } from "@/lib/supabase/server"

export interface GrowthDataPoint {
    date: string
    followers: number
}

export async function getFollowersGrowth(clientId: string): Promise<GrowthDataPoint[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from("followers_growth")
            .select("created_at, followers")
            .eq("client_id", clientId)
            .order("created_at", { ascending: true })

        if (error) {
            console.error("Error fetching growth data:", error)
            return []
        }

        if (!data || data.length === 0) {
            return []
        }

        // Process data to return simple array of date/followers
        return data.map((item: { created_at: string; followers: number | null }) => {
            const date = new Date(item.created_at)
            // Format as "MMM DD" e.g., "Apr 01"
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
            return {
                date: formattedDate,
                followers: item.followers || 0
            }
        })
    } catch (error) {
        console.error("Unexpected error fetching growth data:", error)
        return []
    }
}
