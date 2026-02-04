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
                    generated_content: Json | null
                    id: string
                    is_saved: boolean | null
                    likes: number | null
                    original_post_url: string | null
                    platform: string
                    published_at: string | null
                    status: string
                    thumbnail_url: string | null
                    title: string
                    url: string | null
                    views: number | null
                }
                Insert: {
                    client_id: string
                    created_at?: string
                    generated_content?: Json | null
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    original_post_url?: string | null
                    platform: string
                    published_at?: string | null
                    status?: string
                    thumbnail_url?: string | null
                    title: string
                    url?: string | null
                    views?: number | null
                }
                Update: {
                    client_id?: string
                    created_at?: string
                    generated_content?: Json | null
                    id?: string
                    is_saved?: boolean | null
                    likes?: number | null
                    original_post_url?: string | null
                    platform?: string
                    published_at?: string | null
                    status?: string
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
            posts_scaped: {
                Row: {
                    cliente_conectado: string | null
                    commentsCount: number | null
                    created_at: string
                    displayUrl: string | null
                    id: number
                    likesCount: number | null
                    plataform: string | null
                    postCaption: string | null
                    postId: string | null
                    postUrl: string | null
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
                    plataform?: string | null
                    postCaption?: string | null
                    postId?: string | null
                    postUrl?: string | null
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
                    plataform?: string | null
                    postCaption?: string | null
                    postId?: string | null
                    postUrl?: string | null
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
                    id: string
                    platform: string
                    username: string
                }
                Insert: {
                    avatar_url?: string | null
                    client_id: string
                    created_at?: string
                    id?: string
                    platform: string
                    username: string
                }
                Update: {
                    avatar_url?: string | null
                    client_id?: string
                    created_at?: string
                    id?: string
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
    TableName extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]),
> = (PublicSchema["Tables"] & PublicSchema["Views"])[TableName] extends {
    Row: infer R
}
    ? R
    : never

export type TablesInsert<
    TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName] extends {
    Insert: infer I
}
    ? I
    : never

export type TablesUpdate<
    TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName] extends {
    Update: infer U
}
    ? U
    : never

export type Enums<
    EnumName extends keyof PublicSchema["Enums"],
> = PublicSchema["Enums"][EnumName]

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    keyof PublicSchema["CompositeTypes"],
> = PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
