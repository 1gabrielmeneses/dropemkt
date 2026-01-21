export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            calendar_events: {
                Row: {
                    client_id: string
                    content_item_id: string | null
                    created_at: string
                    id: string
                    marker_id: number | null
                    notes: string | null
                    recurrence_group_id: string | null
                    scheduled_at: string
                    status: string
                }
                Insert: {
                    client_id: string
                    content_item_id?: string | null
                    created_at?: string
                    id?: string
                    marker_id?: number | null
                    notes?: string | null
                    recurrence_group_id?: string | null
                    scheduled_at: string
                    status: string
                }
                Update: {
                    client_id?: string
                    content_item_id?: string | null
                    created_at?: string
                    id?: string
                    marker_id?: number | null
                    notes?: string | null
                    recurrence_group_id?: string | null
                    scheduled_at?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "calendar_events_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "calendar_events_content_item_id_fkey"
                        columns: ["content_item_id"]
                        isOneToOne: false
                        referencedRelation: "content_items"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "calendar_events_marker_id_fkey"
                        columns: ["marker_id"]
                        isOneToOne: false
                        referencedRelation: "content_markers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            clients: {
                Row: {
                    brief: string | null
                    created_at: string
                    id: string
                    instagram_username: string | null
                    logo_url: string | null
                    name: string
                    primary_color: string | null
                    user_id: string
                }
                Insert: {
                    brief?: string | null
                    created_at?: string
                    id?: string
                    instagram_username?: string | null
                    logo_url?: string | null
                    name: string
                    primary_color?: string | null
                    user_id?: string
                }
                Update: {
                    brief?: string | null
                    created_at?: string
                    id?: string
                    instagram_username?: string | null
                    logo_url?: string | null
                    name?: string
                    primary_color?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            content_markers: {
                Row: {
                    client_id: string
                    color: string
                    created_at: string
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    client_id: string
                    color: string
                    created_at?: string
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    client_id?: string
                    color?: string
                    created_at?: string
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "content_markers_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            content_items: {
                Row: {
                    client_id: string
                    created_at: string
                    id: string
                    is_saved: boolean | null
                    likes: number | null
                    platform: string
                    published_at: string | null
                    thumbnail_url: string | null
                    title: string
                    url: string | null
                    views: number | null
                }
                Insert: {
                    client_id: string
                    created_at?: string
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    platform: string
                    published_at?: string | null
                    thumbnail_url?: string | null
                    title: string
                    url?: string | null
                    views?: number | null
                }
                Update: {
                    client_id?: string
                    created_at?: string
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    platform?: string
                    published_at?: string | null
                    thumbnail_url?: string | null
                    title?: string
                    url?: string | null
                    views?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "content_items_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            perfis_selecionados: {
                Row: {
                    created_at: string
                    id: number
                    nicho: string | null
                    nome: string | null
                    username: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    nicho?: string | null
                    nome?: string | null
                    username?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    nicho?: string | null
                    nome?: string | null
                    username?: string | null
                }
                Relationships: []
            }
            posts_salvos: {
                Row: {
                    client_id: string | null
                    created_at: string
                    id: number
                    legendaPost: string | null
                    original_post_id: string | null
                    playCount: string | null
                    scriptUsado: string | null
                    thumbnailurl: string | null
                    tipoPost: string | null
                    urlPost: string | null
                    viewCount: string | null
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string
                    id?: number
                    legendaPost?: string | null
                    original_post_id?: string | null
                    playCount?: string | null
                    scriptUsado?: string | null
                    thumbnailurl?: string | null
                    tipoPost?: string | null
                    urlPost?: string | null
                    viewCount?: string | null
                }
                Update: {
                    client_id?: string | null
                    created_at?: string
                    id?: number
                    legendaPost?: string | null
                    original_post_id?: string | null
                    playCount?: string | null
                    scriptUsado?: string | null
                    thumbnailurl?: string | null
                    tipoPost?: string | null
                    urlPost?: string | null
                    viewCount?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_salvos_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts_scaped: {
                Row: {
                    cliente_conectado: string | null
                    commentsCount: number | null
                    created_at: string
                    displayUrl: string | null
                    id: number
                    likesCount: number | null
                    postCaption: string | null
                    postId: string | null
                    postUrl: string | null
                    timestamp: string | null
                    videoCount: number | null
                    videoPlayCount: number | null
                }
                Insert: {
                    cliente_conectado?: string | null
                    commentsCount?: number | null
                    created_at?: string
                    displayUrl?: string | null
                    id?: number
                    likesCount?: number | null
                    postCaption?: string | null
                    postId?: string | null
                    postUrl?: string | null
                    timestamp?: string | null
                    videoCount?: number | null
                    videoPlayCount?: number | null
                }
                Update: {
                    cliente_conectado?: string | null
                    commentsCount?: number | null
                    created_at?: string
                    displayUrl?: string | null
                    id?: number
                    likesCount?: number | null
                    postCaption?: string | null
                    postId?: string | null
                    postUrl?: string | null
                    timestamp?: string | null
                    videoCount?: number | null
                    videoPlayCount?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_scaped_cliente_conectado_fkey"
                        columns: ["cliente_conectado"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tracked_profiles: {
                Row: {
                    avatar_url: string | null
                    client_id: string
                    created_at: string
                    handle: string
                    id: string
                    name: string | null
                    platform: string
                    tags: string[] | null
                }
                Insert: {
                    avatar_url?: string | null
                    client_id: string
                    created_at?: string
                    handle: string
                    id?: string
                    name?: string | null
                    platform: string
                    tags?: string[] | null
                }
                Update: {
                    avatar_url?: string | null
                    client_id?: string
                    created_at?: string
                    handle?: string
                    id?: string
                    name?: string | null
                    platform?: string
                    tags?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tracked_profiles_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]
type DefaultSchema = PublicSchema

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
