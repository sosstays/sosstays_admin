export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          arrival_time: string | null
          channel: string
          check_in: string
          check_out: string
          checkin_token: string | null
          confirmation_sent_at: string | null
          created_at: string | null
          guest_id: string | null
          guest_name_raw: string | null
          id: string
          lock_code: string | null
          ota_email: string | null
          ota_phone: string | null
          ota_phone_reliable: boolean | null
          property_id: string | null
          reminder_sent_at: string | null
          revenue: number | null
          room_number: string | null
          status: string | null
          uplisting_reservation_id: string
        }
        Insert: {
          arrival_time?: string | null
          channel: string
          check_in: string
          check_out: string
          checkin_token?: string | null
          confirmation_sent_at?: string | null
          created_at?: string | null
          guest_id?: string | null
          guest_name_raw?: string | null
          id?: string
          lock_code?: string | null
          ota_email?: string | null
          ota_phone?: string | null
          ota_phone_reliable?: boolean | null
          property_id?: string | null
          reminder_sent_at?: string | null
          revenue?: number | null
          room_number?: string | null
          status?: string | null
          uplisting_reservation_id: string
        }
        Update: {
          arrival_time?: string | null
          channel?: string
          check_in?: string
          check_out?: string
          checkin_token?: string | null
          confirmation_sent_at?: string | null
          created_at?: string | null
          guest_id?: string | null
          guest_name_raw?: string | null
          id?: string
          lock_code?: string | null
          ota_email?: string | null
          ota_phone?: string | null
          ota_phone_reliable?: boolean | null
          property_id?: string | null
          reminder_sent_at?: string | null
          revenue?: number | null
          room_number?: string | null
          status?: string | null
          uplisting_reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guest_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          mailerlite_synced_at: string | null
          phone: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mailerlite_synced_at?: string | null
          phone?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mailerlite_synced_at?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          access_instructions: string | null
          checkin_subdomain: string | null
          id: string
          name: string
          nickname: string | null
          uplisting_listing_id: string
        }
        Insert: {
          access_instructions?: string | null
          checkin_subdomain?: string | null
          id?: string
          name: string
          nickname?: string | null
          uplisting_listing_id: string
        }
        Update: {
          access_instructions?: string | null
          checkin_subdomain?: string | null
          id?: string
          name?: string
          nickname?: string | null
          uplisting_listing_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      guest_profiles: {
        Row: {
          channels_used: string[] | null
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          first_stay: string | null
          id: string | null
          last_checkout: string | null
          last_name: string | null
          last_stay: string | null
          lifetime_revenue: number | null
          properties_stayed: string[] | null
          total_stays: number | null
        }
        Relationships: []
      }
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
