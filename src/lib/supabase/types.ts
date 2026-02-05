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
            api_tokens: {
                Row: {
                    client_id: string
                    created_at: string
                    id: number
                    name: string
                    token: string
                }
                Insert: {
                    client_id: string
                    created_at?: string
                    id?: number
                    name: string
                    token: string
                }
                Update: {
                    client_id?: string
                    created_at?: string
                    id?: number
                    name?: string
                    token?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "api_tokens_client_id_fkey"
                        columns: ["client_id"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    },
                ]
            }
            calendar_events: {
                Row: {
                    client_id: string
                    content_item_id: string | null
                    created_at: string
                    id: string
                    links: Json | null
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
                    links?: Json | null
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
                    links?: Json | null
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
                    avg_comments: number | null
                    avg_like: number | null
                    avg_views: number | null
                    brief: string | null
                    category: string | null
                    content_strategy: string[] | null
                    created_at: string
                    followers_count: number | null
                    id: string
                    instagram_username: string | null
                    key_competitors: string[] | null
                    location: string | null
                    logo_url: string | null
                    name: string | null
                    niche_description: string | null
                    posts_count: number | null
                    primary_color: string | null
                    sub_category: string | null
                    target_audience: string | null
                    tone_of_voice: string | null
                    user_id: string | null
                    views_count: number | null
                }
                Insert: {
                    avg_comments?: number | null
                    avg_like?: number | null
                    avg_views?: number | null
                    brief?: string | null
                    category?: string | null
                    content_strategy?: string[] | null
                    created_at?: string
                    followers_count?: number | null
                    id?: string
                    instagram_username?: string | null
                    key_competitors?: string[] | null
                    location?: string | null
                    logo_url?: string | null
                    name?: string | null
                    niche_description?: string | null
                    posts_count?: number | null
                    primary_color?: string | null
                    sub_category?: string | null
                    target_audience?: string | null
                    tone_of_voice?: string | null
                    user_id?: string | null
                    views_count?: number | null
                }
                Update: {
                    avg_comments?: number | null
                    avg_like?: number | null
                    avg_views?: number | null
                    brief?: string | null
                    category?: string | null
                    content_strategy?: string[] | null
                    created_at?: string
                    followers_count?: number | null
                    id?: string
                    instagram_username?: string | null
                    key_competitors?: string[] | null
                    location?: string | null
                    logo_url?: string | null
                    name?: string | null
                    niche_description?: string | null
                    posts_count?: number | null
                    primary_color?: string | null
                    sub_category?: string | null
                    target_audience?: string | null
                    tone_of_voice?: string | null
                    user_id?: string | null
                    views_count?: number | null
                }
                Relationships: []
            }
            content_items: {
                Row: {
                    client_id: string
                    created_at: string
                    generated_content: string | null
                    id: string
                    is_saved: boolean | null
                    likes: number | null
                    original_post_url: string | null
                    platform: string
                    published_at: string | null
                    status: string
                    thumbnail_url: string | null
                    title: string
                    url: string
                    views: number | null
                }
                Insert: {
                    client_id: string
                    created_at?: string
                    generated_content?: string | null
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    original_post_url?: string | null
                    platform: string
                    published_at?: string | null
                    status?: string
                    thumbnail_url?: string | null
                    title: string
                    url: string
                    views?: number | null
                }
                Update: {
                    client_id?: string
                    created_at?: string
                    generated_content?: string | null
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    original_post_url?: string | null
                    platform?: string
                    published_at?: string | null
                    status?: string
                    thumbnail_url?: string | null
                    title?: string
                    url?: string
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
                    color?: string
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
            followers_growth: {
                Row: {
                    client_id: string | null
                    created_at: string
                    followers: number | null
                    id: number
                }
                Insert: {
                    client_id?: string | null
                    created_at?: string
                    followers?: number | null
                    id?: number
                }
                Update: {
                    client_id?: string | null
                    created_at?: string
                    followers?: number | null
                    id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "followers_growth_client_id_fkey"
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
                    commentsCount: number | null
                    created_at: string
                    id: number
                    legendaPost: string | null
                    likesCount: number | null
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
                    commentsCount?: number | null
                    created_at?: string
                    id?: number
                    legendaPost?: string | null
                    likesCount?: number | null
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
                    commentsCount?: number | null
                    created_at?: string
                    id?: number
                    legendaPost?: string | null
                    likesCount?: number | null
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
            tracked_profiles: {
                Row: {
                    avatar_url: string | null
                    client_id: string
                    created_at: string
                    id: string
                    last_scraped_at: string | null
                    platform: string
                    username: string
                }
                Insert: {
                    avatar_url?: string | null
                    client_id: string
                    created_at?: string
                    id?: string
                    last_scraped_at?: string | null
                    platform: string
                    username: string
                }
                Update: {
                    avatar_url?: string | null
                    client_id?: string
                    created_at?: string
                    id?: string
                    last_scraped_at?: string | null
                    platform?: string
                    username?: string
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

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
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
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: Exclude<keyof Database, "__InternalSupabase">
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
