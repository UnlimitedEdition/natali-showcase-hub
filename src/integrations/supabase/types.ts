export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      content: {
        Row: {
          content_html: string | null
          content_text: string | null
          created_at: string
          id: string
          is_published: boolean
          language_code: string
          media_type: string | null
          media_url: string | null
          page_key: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          language_code: string
          media_type?: string | null
          media_url?: string | null
          page_key: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          language_code?: string
          media_type?: string | null
          media_url?: string | null
          page_key?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          audio_url: string | null
          author: string | null
          category: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          episode_number: number | null
          id: string
          is_featured: boolean
          is_published: boolean
          language_code: string
          likes: number | null
          published_date: string | null
          read_time: string | null
          season_number: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          audio_url?: string | null
          author?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          episode_number?: number | null
          id: string
          is_featured?: boolean
          is_published?: boolean
          language_code: string
          likes?: number | null
          published_date?: string | null
          read_time?: string | null
          season_number?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          audio_url?: string | null
          author?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          episode_number?: number | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          language_code?: string
          likes?: number | null
          published_date?: string | null
          read_time?: string | null
          season_number?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      gdpr_consents: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          ip_address: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_consents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmed_at: string | null
          email: string
          id: string
          name: string | null
          status: string
          subscribed_at: string
          unsub_token: string
        }
        Insert: {
          confirmed_at?: string | null
          email: string
          id: string
          name?: string | null
          status?: string
          subscribed_at?: string
          unsub_token?: string
        }
        Update: {
          confirmed_at?: string | null
          email?: string
          id?: string
          name?: string | null
          status?: string
          subscribed_at?: string
          unsub_token?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          email: string
          full_name?: string | null
          id: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      guest_requests: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          language_code: string
          last_name: string
          message: string
          phone: string | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          language_code: string
          last_name: string
          message: string
          phone?: string | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          language_code?: string
          last_name?: string
          message?: string
          phone?: string | null
          reason?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          language_code: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id: string
          key: string
          language_code: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language_code?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: {
        Row: {
          [key: string]: unknown
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: [string, ...string[]]
    }
    CompositeTypes: {
      [_ in never]: {
        [key: string]: unknown
      }
    }
  }
}
