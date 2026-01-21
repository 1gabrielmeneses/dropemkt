import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type ClientRow = Database['public']['Tables']['clients']['Row']
type ProfileRow = Database['public']['Tables']['tracked_profiles']['Row']
type ContentItemRow = Database['public']['Tables']['content_items']['Row']
type CalendarEventRow = Database['public']['Tables']['calendar_events']['Row']

export interface Client extends ClientRow {
    profiles: ProfileRow[]
    savedContent: ContentItemRow[]
    calendarEvents: CalendarEventRow[]
}

interface AppState {
    clients: Client[]
    activeClientId: string | null
    isLoading: boolean

    fetchClients: () => Promise<void>

    addClient: (name: string, brief: string, instagramUsername?: string) => Promise<void>
    setActiveClient: (id: string) => void

    addProfile: (profile: Omit<ProfileRow, 'id' | 'created_at' | 'client_id'>) => Promise<void>
    // updated to allow omitting 'published_at' if optional in form, but required in type? DB says nullable.
    saveContent: (content: Omit<ContentItemRow, 'id' | 'created_at' | 'client_id'>) => Promise<void>
    addToCalendar: (event: Omit<CalendarEventRow, 'id' | 'created_at' | 'client_id'>) => Promise<void>
    enrichClient: (clientId: string, instagramUsername: string, clientName: string) => Promise<void>

    updateClient: (id: string, updates: Partial<ClientRow>) => Promise<void>
    deleteClient: (id: string) => Promise<void>

    getActiveClient: () => Client | undefined
}

const supabase = createClient()

export const useStore = create<AppState>((set, get) => ({
    clients: [],
    activeClientId: null,
    isLoading: false,

    fetchClients: async () => {
        set({ isLoading: true })
        // Fetch clients
        const { data: clients, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (clientsError || !clients) {
            console.error('Error fetching clients:', clientsError)
            set({ isLoading: false })
            return
        }

        // Fetch related data for all clients (for now, simple)
        // In a larger app, we would fetch these only for the active client
        const { data: profiles } = await supabase.from('tracked_profiles').select('*')
        const { data: content } = await supabase.from('content_items').select('*')
        const { data: events } = await supabase.from('calendar_events').select('*')

        const clientsWithData = clients.map(client => ({
            ...client,
            profiles: profiles?.filter(p => p.client_id === client.id) || [],
            savedContent: content?.filter(c => c.client_id === client.id) || [],
            calendarEvents: events?.filter(e => e.client_id === client.id) || []
        }))

        set({
            clients: clientsWithData,
            isLoading: false,
            // Set first client as active if none selected
            activeClientId: get().activeClientId || (clientsWithData.length > 0 ? clientsWithData[0].id : null)
        })
    },

    getActiveClient: () => {
        const { clients, activeClientId } = get()
        return clients.find(c => c.id === activeClientId)
    },

    addClient: async (name, brief, instagramUsername) => {
        const { data, error } = await supabase
            .from('clients')
            .insert({ name, brief, instagram_username: instagramUsername })
            .select()
            .single()

        if (error || !data) {
            console.error("Error creating client", error)
            return
        }

        const newClient: Client = {
            ...data,
            profiles: [],
            savedContent: [],
            calendarEvents: []
        }

        set((state) => ({
            clients: [newClient, ...state.clients],
            activeClientId: newClient.id
        }))
    },

    setActiveClient: (id) => set({ activeClientId: id }),

    addProfile: async (profileData) => {
        const state = get()
        const activeClientId = state.activeClientId
        if (!activeClientId) return

        const { data, error } = await supabase
            .from('tracked_profiles')
            .insert({ ...profileData, client_id: activeClientId })
            .select()
            .single()

        if (error || !data) return

        set((state) => ({
            clients: state.clients.map(c =>
                c.id === activeClientId
                    ? { ...c, profiles: [...c.profiles, data] }
                    : c
            )
        }))
    },

    saveContent: async (contentData) => {
        const state = get()
        const activeClientId = state.activeClientId
        if (!activeClientId) return

        const { data, error } = await supabase
            .from('content_items')
            .insert({ ...contentData, client_id: activeClientId })
            .select()
            .single()

        if (error || !data) return

        set((state) => ({
            clients: state.clients.map(c =>
                c.id === activeClientId
                    ? { ...c, savedContent: [...c.savedContent, data] }
                    : c
            )
        }))
    },

    addToCalendar: async (eventData) => {
        const state = get()
        const activeClientId = state.activeClientId
        if (!activeClientId) return

        const { data, error } = await supabase
            .from('calendar_events')
            .insert({ ...eventData, client_id: activeClientId })
            .select()
            .single()

        if (error || !data) return

        set((state) => ({
            clients: state.clients.map(c =>
                c.id === activeClientId
                    ? { ...c, calendarEvents: [...c.calendarEvents, data] }
                    : c
            )
        }))
    },

    enrichClient: async (clientId, instagramUsername, clientName) => {
        try {
            const response = await fetch('/api/clients/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, instagramUsername, clientName })
            });

            if (!response.ok) throw new Error("Enrichment failed");

            const result = await response.json();
            if (result.success) {
                // Determine active client to update selected state potentially? 
                // Just refetch everything to be safe and get new columns
                await get().fetchClients();
            }
        } catch (e) {
            console.error("Enrichment Action Error", e);
        }
    },

    updateClient: async (id: string, updates: Partial<ClientRow>) => {
        const { data, error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error || !data) {
            console.error("Error updating client", error)
            return
        }

        set((state) => ({
            clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
        }))
    },

    deleteClient: async (id: string) => {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error deleting client", error)
            return
        }

        set((state) => {
            const newClients = state.clients.filter(c => c.id !== id)
            return {
                clients: newClients,
                activeClientId: state.activeClientId === id
                    ? (newClients.length > 0 ? newClients[0].id : null)
                    : state.activeClientId
            }
        })
    }
}))
