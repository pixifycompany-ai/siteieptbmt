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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_settings: {
        Row: {
          card_bg_color: string
          card_bg_opacity: number
          card_border_color: string
          card_border_opacity: number
          card_border_radius: number
          card_border_width: number
          card_button_bg_color: string
          card_button_bg_opacity: number
          card_button_text_color: string
          card_button_text_opacity: number
          card_date_color: string
          card_date_opacity: number
          card_hover_icon_color: string
          card_hover_icon_opacity: number
          card_hover_overlay_color: string
          card_hover_overlay_opacity: number
          card_image_radius: number
          card_shadow_color: string
          card_shadow_opacity: number
          card_shadow_size: number
          card_title_color: string
          card_title_opacity: number
          filter_accent_color: string
          filter_accent_opacity: number
          header_text_color: string
          header_text_opacity: number
          homepage_url: string
          id: string
          load_more_text_color: string
          load_more_text_opacity: number
          page_bg_color: string
          page_bg_opacity: number
          search_bg_color: string
          search_bg_opacity: number
          search_text_color: string
          search_text_opacity: number
          updated_at: string
        }
        Insert: {
          card_bg_color?: string
          card_bg_opacity?: number
          card_border_color?: string
          card_border_opacity?: number
          card_border_radius?: number
          card_border_width?: number
          card_button_bg_color?: string
          card_button_bg_opacity?: number
          card_button_text_color?: string
          card_button_text_opacity?: number
          card_date_color?: string
          card_date_opacity?: number
          card_hover_icon_color?: string
          card_hover_icon_opacity?: number
          card_hover_overlay_color?: string
          card_hover_overlay_opacity?: number
          card_image_radius?: number
          card_shadow_color?: string
          card_shadow_opacity?: number
          card_shadow_size?: number
          card_title_color?: string
          card_title_opacity?: number
          filter_accent_color?: string
          filter_accent_opacity?: number
          header_text_color?: string
          header_text_opacity?: number
          homepage_url?: string
          id?: string
          load_more_text_color?: string
          load_more_text_opacity?: number
          page_bg_color?: string
          page_bg_opacity?: number
          search_bg_color?: string
          search_bg_opacity?: number
          search_text_color?: string
          search_text_opacity?: number
          updated_at?: string
        }
        Update: {
          card_bg_color?: string
          card_bg_opacity?: number
          card_border_color?: string
          card_border_opacity?: number
          card_border_radius?: number
          card_border_width?: number
          card_button_bg_color?: string
          card_button_bg_opacity?: number
          card_button_text_color?: string
          card_button_text_opacity?: number
          card_date_color?: string
          card_date_opacity?: number
          card_hover_icon_color?: string
          card_hover_icon_opacity?: number
          card_hover_overlay_color?: string
          card_hover_overlay_opacity?: number
          card_image_radius?: number
          card_shadow_color?: string
          card_shadow_opacity?: number
          card_shadow_size?: number
          card_title_color?: string
          card_title_opacity?: number
          filter_accent_color?: string
          filter_accent_opacity?: number
          header_text_color?: string
          header_text_opacity?: number
          homepage_url?: string
          id?: string
          load_more_text_color?: string
          load_more_text_opacity?: number
          page_bg_color?: string
          page_bg_opacity?: number
          search_bg_color?: string
          search_bg_opacity?: number
          search_text_color?: string
          search_text_opacity?: number
          updated_at?: string
        }
        Relationships: []
      }
      cartorios: {
        Row: {
          created_at: string
          display_order: number
          email: string | null
          endereco: string | null
          id: string
          instagram_url: string | null
          localidades: string | null
          nome_cartorio: string
          nome_tabeliao: string | null
          site_url: string | null
          tabeliao_genero: string
          telefones: string[]
          updated_at: string
          whatsapp_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          email?: string | null
          endereco?: string | null
          id?: string
          instagram_url?: string | null
          localidades?: string | null
          nome_cartorio: string
          nome_tabeliao?: string | null
          site_url?: string | null
          tabeliao_genero?: string
          telefones?: string[]
          updated_at?: string
          whatsapp_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          email?: string | null
          endereco?: string | null
          id?: string
          instagram_url?: string | null
          localidades?: string | null
          nome_cartorio?: string
          nome_tabeliao?: string | null
          site_url?: string | null
          tabeliao_genero?: string
          telefones?: string[]
          updated_at?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      cartorios_settings: {
        Row: {
          card_bg_color: string
          card_bg_opacity: number
          card_border_radius: number
          card_divider_color: string
          card_divider_opacity: number
          card_gap: number
          card_icon_color: string
          card_icon_opacity: number
          card_label_color: string
          card_min_height: number
          card_social_bg_color: string
          card_social_bg_opacity: number
          card_social_position: string
          card_social_radius: number
          card_subtitle_color: string
          card_subtitle_opacity: number
          card_text_color: string
          card_text_opacity: number
          card_title_color: string
          card_title_opacity: number
          card_width: number
          homepage_url: string
          id: string
          updated_at: string
          widget_bg_color: string
          widget_bg_opacity: number
        }
        Insert: {
          card_bg_color?: string
          card_bg_opacity?: number
          card_border_radius?: number
          card_divider_color?: string
          card_divider_opacity?: number
          card_gap?: number
          card_icon_color?: string
          card_icon_opacity?: number
          card_label_color?: string
          card_min_height?: number
          card_social_bg_color?: string
          card_social_bg_opacity?: number
          card_social_position?: string
          card_social_radius?: number
          card_subtitle_color?: string
          card_subtitle_opacity?: number
          card_text_color?: string
          card_text_opacity?: number
          card_title_color?: string
          card_title_opacity?: number
          card_width?: number
          homepage_url?: string
          id?: string
          updated_at?: string
          widget_bg_color?: string
          widget_bg_opacity?: number
        }
        Update: {
          card_bg_color?: string
          card_bg_opacity?: number
          card_border_radius?: number
          card_divider_color?: string
          card_divider_opacity?: number
          card_gap?: number
          card_icon_color?: string
          card_icon_opacity?: number
          card_label_color?: string
          card_min_height?: number
          card_social_bg_color?: string
          card_social_bg_opacity?: number
          card_social_position?: string
          card_social_radius?: number
          card_subtitle_color?: string
          card_subtitle_opacity?: number
          card_text_color?: string
          card_text_opacity?: number
          card_title_color?: string
          card_title_opacity?: number
          card_width?: number
          homepage_url?: string
          id?: string
          updated_at?: string
          widget_bg_color?: string
          widget_bg_opacity?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          attachments: Json
          author_id: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          display_author_id: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          source: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: Json
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          display_author_id?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          source?: string | null
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: Json
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          display_author_id?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          source?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allowed_sections: string[]
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          job_title: string | null
          must_change_password: boolean
          role: string
        }
        Insert: {
          allowed_sections?: string[]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          job_title?: string | null
          must_change_password?: boolean
          role?: string
        }
        Update: {
          allowed_sections?: string[]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          must_change_password?: boolean
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      daily_maintenance: { Args: never; Returns: undefined }
      get_user_role: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
