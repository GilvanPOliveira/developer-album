export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          headline: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          website_url: string | null
          github_url: string | null
          github_id: number | null
          github_login: string | null
          github_public_repos: number
          github_followers: number
          github_following: number
          github_total_stars: number
          github_synced_at: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          is_public: boolean
          availability_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website_url?: string | null
          github_url?: string | null
          github_id?: number | null
          github_login?: string | null
          github_public_repos?: number
          github_followers?: number
          github_following?: number
          github_total_stars?: number
          github_synced_at?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          is_public?: boolean
          availability_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website_url?: string | null
          github_url?: string | null
          github_id?: number | null
          github_login?: string | null
          github_public_repos?: number
          github_followers?: number
          github_following?: number
          github_total_stars?: number
          github_synced_at?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          is_public?: boolean
          availability_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      stacks: {
        Row: {
          id: string
          name: string
          slug: string
          category: string | null
          icon_name: string | null
          color_token: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category?: string | null
          icon_name?: string | null
          color_token?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string | null
          icon_name?: string | null
          color_token?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profile_stacks: {
        Row: {
          id: string
          profile_id: string
          stack_id: string
          is_primary: boolean
          order_index: number
        }
        Insert: {
          id?: string
          profile_id: string
          stack_id: string
          is_primary?: boolean
          order_index?: number
        }
        Update: {
          id?: string
          profile_id?: string
          stack_id?: string
          is_primary?: boolean
          order_index?: number
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          profile_id: string
          title: string
          slug: string
          description: string | null
          cover_image_url: string | null
          project_url: string | null
          repo_url: string | null
          is_featured: boolean
          visibility: string
          source: string
          github_repo_id: number | null
          github_owner_login: string | null
          github_repo_full_name: string | null
          github_repo_html_url: string | null
          github_language: string | null
          github_default_branch: string | null
          github_stars_count: number
          github_forks_count: number
          github_pushed_at: string | null
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          slug: string
          description?: string | null
          cover_image_url?: string | null
          project_url?: string | null
          repo_url?: string | null
          is_featured?: boolean
          visibility?: string
          source?: string
          github_repo_id?: number | null
          github_owner_login?: string | null
          github_repo_full_name?: string | null
          github_repo_html_url?: string | null
          github_language?: string | null
          github_default_branch?: string | null
          github_stars_count?: number
          github_forks_count?: number
          github_pushed_at?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_image_url?: string | null
          project_url?: string | null
          repo_url?: string | null
          is_featured?: boolean
          visibility?: string
          source?: string
          github_repo_id?: number | null
          github_owner_login?: string | null
          github_repo_full_name?: string | null
          github_repo_html_url?: string | null
          github_language?: string | null
          github_default_branch?: string | null
          github_stars_count?: number
          github_forks_count?: number
          github_pushed_at?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_stacks: {
        Row: {
          id: string
          project_id: string
          stack_id: string
        }
        Insert: {
          id?: string
          project_id: string
          stack_id: string
        }
        Update: {
          id?: string
          project_id?: string
          stack_id?: string
        }
        Relationships: []
      }
      developer_cards: {
        Row: {
          id: string
          profile_id: string
          template: string
          accent_color: string
          rarity_tier: string
          tagline: string | null
          cover_style: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          template?: string
          accent_color?: string
          rarity_tier?: string
          tagline?: string | null
          cover_style?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          template?: string
          accent_color?: string
          rarity_tier?: string
          tagline?: string | null
          cover_style?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      albums: {
        Row: {
          id: string
          owner_profile_id: string
          name: string
          description: string | null
          is_default: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_profile_id: string
          name: string
          description?: string | null
          is_default?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_profile_id?: string
          name?: string
          description?: string | null
          is_default?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      album_items: {
        Row: {
          id: string
          album_id: string
          collected_profile_id: string | null
          source: string
          github_user_id: number | null
          github_login: string | null
          github_name: string | null
          github_avatar_url: string | null
          github_html_url: string | null
          github_bio: string | null
          github_location: string | null
          github_company: string | null
          github_blog: string | null
          github_public_repos: number
          github_followers: number
          github_following: number
          github_total_stars: number
          github_twitter_username: string | null
          added_at: string
          last_synced_at: string | null
          sync_status: string
          sync_error: string | null
          position: number
        }
        Insert: {
          id?: string
          album_id: string
          collected_profile_id?: string | null
          source?: string
          github_user_id?: number | null
          github_login?: string | null
          github_name?: string | null
          github_avatar_url?: string | null
          github_html_url?: string | null
          github_bio?: string | null
          github_location?: string | null
          github_company?: string | null
          github_blog?: string | null
          github_public_repos?: number
          github_followers?: number
          github_following?: number
          github_total_stars?: number
          github_twitter_username?: string | null
          added_at?: string
          last_synced_at?: string | null
          sync_status?: string
          sync_error?: string | null
          position?: number
        }
        Update: {
          id?: string
          album_id?: string
          collected_profile_id?: string | null
          source?: string
          github_user_id?: number | null
          github_login?: string | null
          github_name?: string | null
          github_avatar_url?: string | null
          github_html_url?: string | null
          github_bio?: string | null
          github_location?: string | null
          github_company?: string | null
          github_blog?: string | null
          github_public_repos?: number
          github_followers?: number
          github_following?: number
          github_total_stars?: number
          github_twitter_username?: string | null
          added_at?: string
          last_synced_at?: string | null
          sync_status?: string
          sync_error?: string | null
          position?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          owner_profile_id: string
          target_profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_profile_id: string
          target_profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_profile_id?: string
          target_profile_id?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
