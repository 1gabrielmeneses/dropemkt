"use server"

import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/types"

export type Marker = Database['public']['Tables']['content_markers']['Row']

export async function createMarker(clientId: string, name: string, description: string, color: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('content_markers')
            .insert({
                client_id: clientId,
                name,
                description,
                color,
            })
            .select()
            .single()

        if (error) {
            console.error("[createMarker] Error creating marker:", error)
            return { success: false, error }
        }

        return { success: true, marker: data }
    } catch (error) {
        console.error("[createMarker] Unexpected error:", error)
        return { success: false, error }
    }
}

export async function updateMarker(markerId: number, updates: Partial<Marker>) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('content_markers')
            .update(updates)
            .eq('id', markerId)
            .select()
            .single()

        if (error) {
            console.error("[updateMarker] Error updating marker:", error)
            return { success: false, error }
        }

        return { success: true, marker: data }
    } catch (error) {
        console.error("[updateMarker] Unexpected error:", error)
        return { success: false, error }
    }
}

export async function deleteMarker(markerId: number) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('content_markers')
            .delete()
            .eq('id', markerId)

        if (error) {
            console.error("[deleteMarker] Error deleting marker:", error)
            return { success: false, error }
        }

        return { success: true }
    } catch (error) {
        console.error("[deleteMarker] Unexpected error:", error)
        return { success: false, error }
    }
}

export async function getMarkers(clientId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('content_markers')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("[getMarkers] Error fetching markers:", error)
            return []
        }

        return data as Marker[]
    } catch (error) {
        console.error("[getMarkers] Unexpected error:", error)
        return []
    }
}


export async function createCalendarEvent(
    clientId: string,
    scheduledAt: string,
    markerId?: number,
    contentItemId?: string,
    notes?: string,
    recurrence?: { type: 'none' | 'weeks' | 'permanent', count?: number }
) {
    const supabase = await createClient()

    try {
        const eventsToInsert: any[] = []
        const startDate = new Date(scheduledAt)
        const recurrenceGroupId = recurrence && recurrence.type !== 'none' ? crypto.randomUUID() : null

        let count = 1
        if (recurrence?.type === 'weeks' && recurrence.count) {
            count = recurrence.count
        } else if (recurrence?.type === 'permanent') {
            count = 260 // approx 5 years
        }

        for (let i = 0; i < count; i++) {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + (i * 7))

            eventsToInsert.push({
                client_id: clientId,
                scheduled_at: date.toISOString(),
                marker_id: markerId,
                content_item_id: contentItemId,
                status: 'scheduled',
                notes,
                recurrence_group_id: recurrenceGroupId
            })
        }

        const { data, error } = await supabase
            .from('calendar_events')
            .insert(eventsToInsert)
            .select()

        if (error) {
            console.error("[createCalendarEvent] Error creating event:", error)
            return { success: false, error }
        }

        return { success: true, events: data }
    } catch (error) {
        console.error("[createCalendarEvent] Unexpected error:", error)
        return { success: false, error }
    }
}

export async function getCalendarEvents(clientId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('calendar_events')
            .select(`
                *,
                marker:content_markers(*),
                content_item:content_items(*)
            `)
            .eq('client_id', clientId)

        if (error) {
            console.error("[getCalendarEvents] Error fetching events:", error)
            return []
        }

        return data
    } catch (error) {
        console.error("[getCalendarEvents] Unexpected error:", error)
        return []
    }
}

export async function deleteCalendarEvent(eventId: string) {
    const supabase = await createClient()

    try {
        // First check if event is part of a recurrence group
        const { data: event, error: fetchError } = await supabase
            .from('calendar_events')
            .select('recurrence_group_id')
            .eq('id', eventId)
            .single()

        if (fetchError) {
            console.error("[deleteCalendarEvent] Error fetching event details:", fetchError)
            return { success: false, error: fetchError }
        }

        let query = supabase.from('calendar_events').delete()

        if (event?.recurrence_group_id) {
            query = query.eq('recurrence_group_id', event.recurrence_group_id)
        } else {
            query = query.eq('id', eventId)
        }

        const { error } = await query

        if (error) {
            console.error("[deleteCalendarEvent] Error deleting event(s):", error)
            return { success: false, error }
        }

        return { success: true }
    } catch (error) {
        console.error("[deleteCalendarEvent] Unexpected error:", error)
        return { success: false, error }
    }
}
