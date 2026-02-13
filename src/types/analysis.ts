export interface AnalysisProfile {
    id: string
    created_at: string
    user_id: string
    name: string
    brief: string
    instagram_username: string
    logo_url: string
    primary_color: string | null
    followers_count: number
    posts_count: number
    views_count: number
    category: string
    sub_category: string
    niche_description: string
    content_strategy: string[]
    location: string
    target_audience: string
    tone_of_voice: string
    key_competitors: string[]
    avg_like: number
    avg_comments: number
    avg_views: number
    audience: AudienceAnalysis
    executive_summary: ExecutiveSummary
    basic_profile_info: BasicProfileInfo
    angagement_metrics: EngagementMetrics
    content_categorization: ContentCategorization
    top_viral_posts: ViralPost[]
    niche_and_positioning: NicheAndPositioning
    competitive_landscape: CompetitiveLandscape
    swot_analysis: SWOTAnalysis
    strategic_recommendations: StrategicRecommendations
    appendices: Appendices
    conclusion: Conclusion
    analysis_metadata: AnalysisMetadata
}

export interface AudienceAnalysis {
    desires: string[]
    pain_points: string[]
    demographics: {
        gender: string
        age_range: string
        nationality: string
        professions: string[]
    }
    psychographics: {
        traits: string[]
    }
}

export interface ExecutiveSummary {
    followers: number
    max_views: number
    reach_rate: string
    description: string
    total_posts: number
    key_findings: string[]
    reels_analyzed: number
    viral_posts_count: number
    max_views_multiplier: string
    viral_posts_percentage: string
}

export interface BasicProfileInfo {
    category: string
    username: string
    biography: string
    followers: number
    following: number
    total_posts: number
    account_type: string
    display_name: string
    external_link: string
    story_highlights: {
        analysis: string
        total_count: number
        italy_highlights?: string[]
        other_highlights?: string[]
        [key: string]: any
    }
    biography_analysis: string
    relevant_connections: {
        analysis: string
        followed_by: string
    }
}

export interface EngagementMetrics {
    themes: ThemePerformance[]
    performance_patterns: string
}

export interface ContentCategorization {
    themes: ThemePerformance[]
    performance_patterns: string
}

export interface ThemePerformance {
    examples: string[]
    percentage: number
    theme_name: string
    average_views: number
    characteristics: string[]
    best_performance: boolean
}

export interface ViralPost {
    rank: number
    title: string
    views: number
    category: string
    why_viral: string
    reel_number: number
    lessons_learned: string
    reach_multiplier: string
    patterns_identified: string[]
}

export interface NicheAndPositioning {
    sub_niche: string
    primary_niche: string
    target_audience: AudienceAnalysis
    value_proposition: string
    positioning_strategy: PositioningStrategy[]
    sub_niche_description: string
    content_format_and_style: {
        duration: string
        aesthetics: string[]
        text_usage: string[]
        editing_style: string[]
        visual_format: string[]
        tone_and_voice: string[]
    }
    primary_niche_description: string
    competitive_differentiation: string[]
    value_proposition_breakdown: string[]
}

export interface PositioningStrategy {
    examples: string[]
    strategy: string
    description: string
}

export interface CompetitiveLandscape {
    competitive_matrix: {
        criteria: string[]
        competitors_data: CompetitorData[]
    }
    direct_competitors: DirectCompetitor[]
    market_opportunities: string[]
}

export interface CompetitorData {
    name: string
    differential: string
    transparency: string
    audience_size: string
    specialization: string
    engagement_rate: string
    target_audience: string
    price_positioning: string
}

export interface DirectCompetitor {
    focus: string
    examples: string
    username: string
    positioning: string
    differential: string
    threat_level: string
    competitor_name: string
    pedro_advantages: string
    estimated_followers: string
    competitor_advantages: string
}

export interface SWOTAnalysis {
    threats: SWOTItem[]
    strengths: SWOTItem[]
    weaknesses: SWOTItem[]
    opportunities: SWOTItem[]
}

export interface SWOTItem {
    threat?: string
    strength?: string
    weakness?: string
    opportunity?: string
    description: string
}

export interface StrategicRecommendations {
    long_term: RecommendationAction[]
    short_term: RecommendationAction[]
    medium_term: RecommendationAction[]
}

export interface RecommendationAction {
    action: string
    execution: string[]
    justification: string
    recommendation: string
}

export interface Appendices {
    summary: string
    core_assets: string
    report_metadata: {
        date: string
        version: string
        total_words: number
        generated_by: string
    }
    growth_potential: string
    growth_opportunities: string[]
}

export interface Conclusion {
    summary: string
    core_assets: string
    report_metadata: {
        date: string
        version: string
        total_words: number
        generated_by: string
    }
    growth_potential: string
    growth_opportunities: string[]
}

export interface AnalysisMetadata {
    analyst: string
    username: string
    profile_url: string
    total_words: number
    profile_name: string
    analysis_date: string
}
