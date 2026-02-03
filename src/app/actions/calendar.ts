"use server"

import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/types"

export type Marker = Database['public']['Tables']['content_markers']['Row']

/**
 * Ensures a content item exists in the `content_items` table (migrating from `posts_salvos` if needed).
 * If the input ID is a valid UUID, it assumes it's already a `content_item`.
 * If it's a number (legacy), it looks up the original post and duplicates it to `content_items` or finds an existing match.
 */
export async function ensureContentItem(
    legacyIdOrUuid: string | number,
    itemData?: {
        title: string,
        url: string,
        thumbnail_url: string,
        platform: string,
        client_id: string,
        views?: number,
        likes?: number
    }
) {
    const supabase = await createClient()

    // If it's already a UUID, assume it's valid
    if (typeof legacyIdOrUuid === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(legacyIdOrUuid)) {
        return { success: true, id: legacyIdOrUuid }
    }

    // It's a legacy numeric ID (or we treat it as such for migration)
    // First, check if we already have this URL in content_items for this client
    if (itemData?.url) {
        const { data: existing } = await supabase
            .from('content_items')
            .select('id')
            .eq('client_id', itemData.client_id)
            .eq('url', itemData.url)
            .single()

        if (existing) {
            return { success: true, id: existing.id }
        }
    }

    // Not found, create it
    if (!itemData) {
        return { success: false, error: "Missing item data for migration" }
    }

    const { data: newItem, error } = await supabase
        .from('content_items')
        .insert({
            client_id: itemData.client_id,
            title: itemData.title,
            url: itemData.url,
            thumbnail_url: itemData.thumbnail_url,
            platform: itemData.platform,
            views: itemData.views || 0,
            likes: itemData.likes || 0,
            is_saved: true
        })
        .select()
        .single()

    if (error || !newItem) {
        console.error("Error migrating content item:", error)
        return { success: false, error: error?.message || 'Failed to create content item' }
    }

    return { success: true, id: newItem.id }
}

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

export async function updateEventRecurrence(
    eventId: string,
    recurrenceWeeks: number
) {
    const supabase = await createClient()

    try {
        // First, get the original event
        const { data: originalEvent, error: fetchError } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('id', eventId)
            .single()

        if (fetchError || !originalEvent) {
            console.error("[updateEventRecurrence] Error fetching event:", fetchError)
            return { success: false, error: fetchError }
        }

        // If event already has recurrence, delete the old group first
        if (originalEvent.recurrence_group_id) {
            await supabase
                .from('calendar_events')
                .delete()
                .eq('recurrence_group_id', originalEvent.recurrence_group_id)
        } else {
            // Delete the single event
            await supabase
                .from('calendar_events')
                .delete()
                .eq('id', eventId)
        }

        // Create new recurring series
        const recurrenceGroupId = crypto.randomUUID()
        const startDate = new Date(originalEvent.scheduled_at)
        const eventsToInsert: any[] = []

        const count = Math.min(recurrenceWeeks, 10) // Limit to 10 weeks

        for (let i = 0; i < count; i++) {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + (i * 7))

            eventsToInsert.push({
                client_id: originalEvent.client_id,
                scheduled_at: date.toISOString(),
                marker_id: originalEvent.marker_id,
                content_item_id: originalEvent.content_item_id,
                status: originalEvent.status,
                notes: originalEvent.notes,
                recurrence_group_id: recurrenceGroupId
            })
        }

        const { data, error } = await supabase
            .from('calendar_events')
            .insert(eventsToInsert)
            .select()

        if (error) {
            console.error("[updateEventRecurrence] Error creating recurring events:", error)
            return { success: false, error }
        }

        return { success: true, events: data }
    } catch (error) {
        console.error("[updateEventRecurrence] Unexpected error:", error)
        return { success: false, error }
    }
}
