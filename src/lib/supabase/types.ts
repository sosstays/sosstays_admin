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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          body: string | null
          booking_id: string | null
          channel: string
          created_at: string
          created_by: string | null
          direction: string
          email: string | null
          error: string | null
          external_id: string | null
          id: string
          metadata: Json
          occurred_at: string
          record_id: string | null
          record_table: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          booking_id?: string | null
          channel: string
          created_at?: string
          created_by?: string | null
          direction?: string
          email?: string | null
          error?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          record_id?: string | null
          record_table?: string | null
          status?: string
          title: string
          type: string
        }
        Update: {
          body?: string | null
          booking_id?: string | null
          channel?: string
          created_at?: string
          created_by?: string | null
          direction?: string
          email?: string | null
          error?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          record_id?: string | null
          record_table?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bespoke_trip_leads: {
        Row: {
          accommodation_preference: string | null
          base_or_route: string | null
          consent: boolean | null
          consent_at: string | null
          created_at: string
          email: string
          event_type: string | null
          group_size: string | null
          id: string
          ideal_month: string | null
          interests: string | null
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          name: string | null
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accommodation_preference?: string | null
          base_or_route?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          email: string
          event_type?: string | null
          group_size?: string | null
          id?: string
          ideal_month?: string | null
          interests?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accommodation_preference?: string | null
          base_or_route?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          email?: string
          event_type?: string | null
          group_size?: string | null
          id?: string
          ideal_month?: string | null
          interests?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          ota_email_reliable: boolean
          ota_phone: string | null
          ota_phone_reliable: boolean | null
          post_stay_sent_at: string | null
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
          ota_email_reliable?: boolean
          ota_phone?: string | null
          ota_phone_reliable?: boolean | null
          post_stay_sent_at?: string | null
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
          ota_email_reliable?: boolean
          ota_phone?: string | null
          ota_phone_reliable?: boolean | null
          post_stay_sent_at?: string | null
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
      concierge_signups: {
        Row: {
          booking_id: string | null
          created_at: string
          email: string
          id: string
          last_seen_at: string
          marketing_consent: boolean
          name: string | null
          property_id: string | null
          property_name: string | null
          site_host: string
          visit_count: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          email: string
          id?: string
          last_seen_at?: string
          marketing_consent?: boolean
          name?: string | null
          property_id?: string | null
          property_name?: string | null
          site_host: string
          visit_count?: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          email?: string
          id?: string
          last_seen_at?: string
          marketing_consent?: boolean
          name?: string | null
          property_id?: string | null
          property_name?: string | null
          site_host?: string
          visit_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "concierge_signups_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_signups_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_queries: {
        Row: {
          consent: boolean | null
          consent_at: string | null
          created_at: string
          email: string
          how_heard: string | null
          id: string
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          message: string | null
          name: string | null
          phone: string | null
          property_name: string | null
          status: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          email: string
          how_heard?: string | null
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          property_name?: string | null
          status?: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          email?: string
          how_heard?: string | null
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          message?: string | null
          name?: string | null
          phone?: string | null
          property_name?: string | null
          status?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      corporate_leads: {
        Row: {
          company: string | null
          consent: boolean | null
          consent_at: string | null
          created_at: string
          duration: string | null
          email: string
          end_date: string | null
          how_heard: string | null
          id: string
          location_needed: string | null
          location_preference: string | null
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          message: string | null
          name: string | null
          number_of_workers: string | null
          other_requirements: string | null
          phone: string | null
          room_preference: string | null
          schedule_preference: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          duration?: string | null
          email: string
          end_date?: string | null
          how_heard?: string | null
          id?: string
          location_needed?: string | null
          location_preference?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          message?: string | null
          name?: string | null
          number_of_workers?: string | null
          other_requirements?: string | null
          phone?: string | null
          room_preference?: string | null
          schedule_preference?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          duration?: string | null
          email?: string
          end_date?: string | null
          how_heard?: string | null
          id?: string
          location_needed?: string | null
          location_preference?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          message?: string | null
          name?: string | null
          number_of_workers?: string | null
          other_requirements?: string | null
          phone?: string | null
          room_preference?: string | null
          schedule_preference?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_stay_properties: {
        Row: {
          amenities: string | null
          area: string | null
          bathrooms: number | null
          bedroom_breakdown: Json | null
          bedrooms: number | null
          beds_total: number | null
          captured_by: string
          county: string | null
          created_at: string
          description: string | null
          how_heard: string | null
          id: string
          listing_url: string | null
          max_guests_extended: number | null
          max_guests_standard: number | null
          notes: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          photo_urls: string[]
          photos_url: string | null
          property_name: string
          public_listing_consent: string
          submission_status: string
          updated_at: string
        }
        Insert: {
          amenities?: string | null
          area?: string | null
          bathrooms?: number | null
          bedroom_breakdown?: Json | null
          bedrooms?: number | null
          beds_total?: number | null
          captured_by?: string
          county?: string | null
          created_at?: string
          description?: string | null
          how_heard?: string | null
          id?: string
          listing_url?: string | null
          max_guests_extended?: number | null
          max_guests_standard?: number | null
          notes?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          photo_urls?: string[]
          photos_url?: string | null
          property_name: string
          public_listing_consent?: string
          submission_status?: string
          updated_at?: string
        }
        Update: {
          amenities?: string | null
          area?: string | null
          bathrooms?: number | null
          bedroom_breakdown?: Json | null
          bedrooms?: number | null
          beds_total?: number | null
          captured_by?: string
          county?: string | null
          created_at?: string
          description?: string | null
          how_heard?: string | null
          id?: string
          listing_url?: string | null
          max_guests_extended?: number | null
          max_guests_standard?: number | null
          notes?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          photo_urls?: string[]
          photos_url?: string | null
          property_name?: string
          public_listing_consent?: string
          submission_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_stay_quotes: {
        Row: {
          billing_period: string | null
          booking_channel: string | null
          captured_by: string
          cleaning_cost_extra_eur: number | null
          cleaning_included: string | null
          cleaning_runs_per_period: number | null
          client_price_eur: number | null
          created_at: string
          id: string
          markup_pct: number
          notes: string | null
          occupancy_guests: string | null
          owner_quote_eur: number | null
          property_id: string
          quote_captured_at: string
          source_contact: string | null
          status: string
          stay_end: string | null
          stay_start: string | null
          updated_at: string
          week_basis: string | null
        }
        Insert: {
          billing_period?: string | null
          booking_channel?: string | null
          captured_by?: string
          cleaning_cost_extra_eur?: number | null
          cleaning_included?: string | null
          cleaning_runs_per_period?: number | null
          client_price_eur?: number | null
          created_at?: string
          id?: string
          markup_pct?: number
          notes?: string | null
          occupancy_guests?: string | null
          owner_quote_eur?: number | null
          property_id: string
          quote_captured_at?: string
          source_contact?: string | null
          status?: string
          stay_end?: string | null
          stay_start?: string | null
          updated_at?: string
          week_basis?: string | null
        }
        Update: {
          billing_period?: string | null
          booking_channel?: string | null
          captured_by?: string
          cleaning_cost_extra_eur?: number | null
          cleaning_included?: string | null
          cleaning_runs_per_period?: number | null
          client_price_eur?: number | null
          created_at?: string
          id?: string
          markup_pct?: number
          notes?: string | null
          occupancy_guests?: string | null
          owner_quote_eur?: number | null
          property_id?: string
          quote_captured_at?: string
          source_contact?: string | null
          status?: string
          stay_end?: string | null
          stay_start?: string | null
          updated_at?: string
          week_basis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_stay_quotes_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "corporate_lead_property_matches"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "corporate_stay_quotes_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "corporate_stay_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_maker_leads: {
        Row: {
          billing_type: string | null
          budget_per_gift: number | null
          consent: boolean | null
          consent_at: string | null
          created_at: string
          delivery_method: string | null
          email: string
          format: string | null
          id: string
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          name: string | null
          package_items: string | null
          package_label: string | null
          package_total: number | null
          phone: string | null
          quantity: string | null
          recipient_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          billing_type?: string | null
          budget_per_gift?: number | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          delivery_method?: string | null
          email: string
          format?: string | null
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          name?: string | null
          package_items?: string | null
          package_label?: string | null
          package_total?: number | null
          phone?: string | null
          quantity?: string | null
          recipient_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          billing_type?: string | null
          budget_per_gift?: number | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          delivery_method?: string | null
          email?: string
          format?: string | null
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          name?: string | null
          package_items?: string | null
          package_label?: string | null
          package_total?: number | null
          phone?: string | null
          quantity?: string | null
          recipient_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string | null
          email_reliable: boolean | null
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
          email_reliable?: boolean | null
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
          email_reliable?: boolean | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mailerlite_synced_at?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      landlord_leads: {
        Row: {
          adr: string | null
          area: string | null
          bedrooms: string | null
          biggest_challenge: string | null
          company: string | null
          consent: boolean | null
          consent_at: string | null
          created_at: string
          current_revenue: number | null
          email: string
          estimated_potential: number | null
          estimated_uplift: number | null
          hours_per_week: number | null
          how_heard: string | null
          id: string
          landlord_situation: string | null
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          marketing_consent: boolean | null
          marketing_consent_at: string | null
          name: string | null
          num_properties: string | null
          occupancy: string | null
          phone: string | null
          platforms: string | null
          property_description: string | null
          property_id: string | null
          source: string | null
          status: string
          updated_at: string
          uplift_percent: number | null
        }
        Insert: {
          adr?: string | null
          area?: string | null
          bedrooms?: string | null
          biggest_challenge?: string | null
          company?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          current_revenue?: number | null
          email: string
          estimated_potential?: number | null
          estimated_uplift?: number | null
          hours_per_week?: number | null
          how_heard?: string | null
          id?: string
          landlord_situation?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          marketing_consent?: boolean | null
          marketing_consent_at?: string | null
          name?: string | null
          num_properties?: string | null
          occupancy?: string | null
          phone?: string | null
          platforms?: string | null
          property_description?: string | null
          property_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          uplift_percent?: number | null
        }
        Update: {
          adr?: string | null
          area?: string | null
          bedrooms?: string | null
          biggest_challenge?: string | null
          company?: string | null
          consent?: boolean | null
          consent_at?: string | null
          created_at?: string
          current_revenue?: number | null
          email?: string
          estimated_potential?: number | null
          estimated_uplift?: number | null
          hours_per_week?: number | null
          how_heard?: string | null
          id?: string
          landlord_situation?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          marketing_consent?: boolean | null
          marketing_consent_at?: string | null
          name?: string | null
          num_properties?: string | null
          occupancy?: string | null
          phone?: string | null
          platforms?: string | null
          property_description?: string | null
          property_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          uplift_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_leads: {
        Row: {
          about_business: string | null
          business_name: string | null
          category: string | null
          consent: boolean | null
          consent_at: string | null
          contact_name: string | null
          created_at: string
          email: string
          id: string
          location: string | null
          mailerlite_subscriber_id: string | null
          mailerlite_synced_at: string | null
          phone: string | null
          referral: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          about_business?: string | null
          business_name?: string | null
          category?: string | null
          consent?: boolean | null
          consent_at?: string | null
          contact_name?: string | null
          created_at?: string
          email: string
          id?: string
          location?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          phone?: string | null
          referral?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          about_business?: string | null
          business_name?: string | null
          category?: string | null
          consent?: boolean | null
          consent_at?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          mailerlite_subscriber_id?: string | null
          mailerlite_synced_at?: string | null
          phone?: string | null
          referral?: string | null
          status?: string
          updated_at?: string
          website?: string | null
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
          public_name: string | null
          uplisting_listing_id: string
        }
        Insert: {
          access_instructions?: string | null
          checkin_subdomain?: string | null
          id?: string
          name: string
          nickname?: string | null
          public_name?: string | null
          uplisting_listing_id: string
        }
        Update: {
          access_instructions?: string | null
          checkin_subdomain?: string | null
          id?: string
          name?: string
          nickname?: string | null
          public_name?: string | null
          uplisting_listing_id?: string
        }
        Relationships: []
      }
      shop_orders: {
        Row: {
          amount_total: number | null
          arrival_date: string | null
          buyer_email: string
          buyer_name: string | null
          buyer_phone: string | null
          created_at: string
          currency: string | null
          delivery_address: string | null
          delivery_method: string | null
          delivery_postcode: string | null
          fulfilment_status: string
          gift_note: string | null
          id: string
          product_id: string | null
          product_kind: string
          product_name: string
          property_name: string | null
          property_slug: string | null
          quantity: number
          receipt_sent_at: string | null
          recipient_email: string | null
          recipient_name: string | null
          stay_date_type: string | null
          stripe_payment_intent_id: string
          updated_at: string
        }
        Insert: {
          amount_total?: number | null
          arrival_date?: string | null
          buyer_email: string
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          currency?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          delivery_postcode?: string | null
          fulfilment_status?: string
          gift_note?: string | null
          id?: string
          product_id?: string | null
          product_kind: string
          product_name: string
          property_name?: string | null
          property_slug?: string | null
          quantity: number
          receipt_sent_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          stay_date_type?: string | null
          stripe_payment_intent_id: string
          updated_at?: string
        }
        Update: {
          amount_total?: number | null
          arrival_date?: string | null
          buyer_email?: string
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          currency?: string | null
          delivery_address?: string | null
          delivery_method?: string | null
          delivery_postcode?: string | null
          fulfilment_status?: string
          gift_note?: string | null
          id?: string
          product_id?: string | null
          product_kind?: string
          product_name?: string
          property_name?: string | null
          property_slug?: string | null
          quantity?: number
          receipt_sent_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          stay_date_type?: string | null
          stripe_payment_intent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      signatories: {
        Row: {
          confirm_token: string
          confirmed_at: string | null
          county: string
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          letter_version: string
          name: string
          publish_name: boolean
          role: string
          urban_or_rural: string | null
          withdrawn_at: string | null
        }
        Insert: {
          confirm_token?: string
          confirmed_at?: string | null
          county: string
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          letter_version: string
          name: string
          publish_name?: boolean
          role: string
          urban_or_rural?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          confirm_token?: string
          confirmed_at?: string | null
          county?: string
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          letter_version?: string
          name?: string
          publish_name?: boolean
          role?: string
          urban_or_rural?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          attempts: number
          body: string
          booking_id: string | null
          created_at: string
          dedupe_key: string | null
          delivered_at: string | null
          error_code: number | null
          error_message: string | null
          id: string
          kind: string
          last_attempt_at: string | null
          num_segments: number | null
          scheduled_for: string
          sent_at: string | null
          status: string
          to_phone: string
          twilio_sid: string | null
          updated_at: string
        }
        Insert: {
          attempts?: number
          body: string
          booking_id?: string | null
          created_at?: string
          dedupe_key?: string | null
          delivered_at?: string | null
          error_code?: number | null
          error_message?: string | null
          id?: string
          kind: string
          last_attempt_at?: string | null
          num_segments?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          to_phone: string
          twilio_sid?: string | null
          updated_at?: string
        }
        Update: {
          attempts?: number
          body?: string
          booking_id?: string | null
          created_at?: string
          dedupe_key?: string | null
          delivered_at?: string | null
          error_code?: number | null
          error_message?: string | null
          id?: string
          kind?: string
          last_attempt_at?: string | null
          num_segments?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          to_phone?: string
          twilio_sid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contacts: {
        Row: {
          email: string | null
          first_seen: string | null
          last_seen: string | null
          name: string | null
          phone: string | null
          roles: string[] | null
          touchpoints: number | null
        }
        Relationships: []
      }
      corporate_lead_property_matches: {
        Row: {
          area: string | null
          county: string | null
          lead_company: string | null
          lead_id: string | null
          lead_status: string | null
          location_needed: string | null
          match_score: number | null
          property_id: string | null
          property_name: string | null
        }
        Relationships: []
      }
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
