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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_norm_compliance: {
        Row: {
          account_id: string
          created_at: string | null
          evidence_data: Json | null
          evidence_summary: string | null
          id: string
          last_evaluated_at: string | null
          norm_id: string
          status: string
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          evidence_data?: Json | null
          evidence_summary?: string | null
          id?: string
          last_evaluated_at?: string | null
          norm_id: string
          status?: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          evidence_data?: Json | null
          evidence_summary?: string | null
          id?: string
          last_evaluated_at?: string | null
          norm_id?: string
          status?: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_norm_compliance_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_norm_compliance_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_norm_compliance_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_personal_account: boolean
          name: string
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_personal_account?: boolean
          name: string
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_personal_account?: boolean
          name?: string
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      accounts_memberships: {
        Row: {
          account_id: string
          account_role: string
          created_at: string
          created_by: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["account_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      billing_customers: {
        Row: {
          account_id: string
          customer_id: string
          email: string | null
          id: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Insert: {
          account_id: string
          customer_id: string
          email?: string | null
          id?: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Update: {
          account_id?: string
          customer_id?: string
          email?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["billing_provider"]
        }
        Relationships: [
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_records: {
        Row: {
          block_number: number | null
          created_at: string | null
          geolocation_trail: Json | null
          hashed_data: Json
          id: string
          is_verified: boolean | null
          listing_id: string
          previous_hash: string | null
          record_hash: string
          transaction_id: string
          verification_timestamp: string | null
        }
        Insert: {
          block_number?: number | null
          created_at?: string | null
          geolocation_trail?: Json | null
          hashed_data: Json
          id?: string
          is_verified?: boolean | null
          listing_id: string
          previous_hash?: string | null
          record_hash: string
          transaction_id: string
          verification_timestamp?: string | null
        }
        Update: {
          block_number?: number | null
          created_at?: string | null
          geolocation_trail?: Json | null
          hashed_data?: Json
          id?: string
          is_verified?: boolean | null
          listing_id?: string
          previous_hash?: string | null
          record_hash?: string
          transaction_id?: string
          verification_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_records_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_emission_factors: {
        Row: {
          created_at: string | null
          id: string
          incineration_factor: number
          is_active: boolean | null
          landfill_factor: number
          material_category: string
          material_subcategory: string | null
          recycling_process_factor: number
          source: string | null
          source_year: number | null
          updated_at: string | null
          virgin_production_factor: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          incineration_factor: number
          is_active?: boolean | null
          landfill_factor: number
          material_category: string
          material_subcategory?: string | null
          recycling_process_factor: number
          source?: string | null
          source_year?: number | null
          updated_at?: string | null
          virgin_production_factor: number
        }
        Update: {
          created_at?: string | null
          id?: string
          incineration_factor?: number
          is_active?: boolean | null
          landfill_factor?: number
          material_category?: string
          material_subcategory?: string | null
          recycling_process_factor?: number
          source?: string | null
          source_year?: number | null
          updated_at?: string | null
          virgin_production_factor?: number
        }
        Relationships: []
      }
      carbon_records: {
        Row: {
          account_id: string
          calculated_at: string | null
          calculation_method: string | null
          co2_avoided: number | null
          co2_landfill_avoided: number | null
          co2_net_benefit: number | null
          co2_recycling_process: number | null
          co2_transport: number | null
          co2_virgin_production: number | null
          created_at: string | null
          destination_location: string | null
          distance_km: number | null
          emission_factor_id: string | null
          id: string
          material_category: string
          material_subcategory: string | null
          origin_location: string | null
          transaction_id: string
          transport_factor_id: string | null
          transport_mode: string | null
          weight_tonnes: number
        }
        Insert: {
          account_id: string
          calculated_at?: string | null
          calculation_method?: string | null
          co2_avoided?: number | null
          co2_landfill_avoided?: number | null
          co2_net_benefit?: number | null
          co2_recycling_process?: number | null
          co2_transport?: number | null
          co2_virgin_production?: number | null
          created_at?: string | null
          destination_location?: string | null
          distance_km?: number | null
          emission_factor_id?: string | null
          id?: string
          material_category: string
          material_subcategory?: string | null
          origin_location?: string | null
          transaction_id: string
          transport_factor_id?: string | null
          transport_mode?: string | null
          weight_tonnes: number
        }
        Update: {
          account_id?: string
          calculated_at?: string | null
          calculation_method?: string | null
          co2_avoided?: number | null
          co2_landfill_avoided?: number | null
          co2_net_benefit?: number | null
          co2_recycling_process?: number | null
          co2_transport?: number | null
          co2_virgin_production?: number | null
          created_at?: string | null
          destination_location?: string | null
          distance_km?: number | null
          emission_factor_id?: string | null
          id?: string
          material_category?: string
          material_subcategory?: string | null
          origin_location?: string | null
          transaction_id?: string
          transport_factor_id?: string | null
          transport_mode?: string | null
          weight_tonnes?: number
        }
        Relationships: [
          {
            foreignKeyName: "carbon_records_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_records_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_records_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_records_emission_factor_id_fkey"
            columns: ["emission_factor_id"]
            isOneToOne: false
            referencedRelation: "carbon_emission_factors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_records_transport_factor_id_fkey"
            columns: ["transport_factor_id"]
            isOneToOne: false
            referencedRelation: "transport_emission_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_config: {
        Row: {
          commission_type: string
          created_at: string | null
          description: string | null
          flat_rate: number | null
          id: string
          is_active: boolean | null
          name: string
          tiers: Json | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          commission_type?: string
          created_at?: string | null
          description?: string | null
          flat_rate?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          tiers?: Json | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          commission_type?: string
          created_at?: string | null
          description?: string | null
          flat_rate?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          tiers?: Json | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      config: {
        Row: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing: boolean
          enable_team_account_billing: boolean
          enable_team_accounts: boolean
        }
        Insert: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Update: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Relationships: []
      }
      esg_emission_factors: {
        Row: {
          category: string
          country: string | null
          created_at: string | null
          emission_factor: number
          factor_name: string
          id: string
          scope: number
          source: string | null
          source_year: number | null
          subcategory: string
          unit: string
        }
        Insert: {
          category: string
          country?: string | null
          created_at?: string | null
          emission_factor: number
          factor_name: string
          id?: string
          scope: number
          source?: string | null
          source_year?: number | null
          subcategory: string
          unit: string
        }
        Update: {
          category?: string
          country?: string | null
          created_at?: string | null
          emission_factor?: number
          factor_name?: string
          id?: string
          scope?: number
          source?: string | null
          source_year?: number | null
          subcategory?: string
          unit?: string
        }
        Relationships: []
      }
      esg_reports: {
        Row: {
          account_id: string
          created_at: string | null
          emissions_per_employee: number | null
          esg_data_id: string
          generated_at: string | null
          id: string
          net_emissions: number | null
          recommendations: Json | null
          report_status: string | null
          report_title: string | null
          report_type: string
          report_url: string | null
          report_year: number
          total_avoided_via_platform: number | null
          total_emissions: number | null
          total_scope1: number | null
          total_scope2: number | null
          total_scope3: number | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          emissions_per_employee?: number | null
          esg_data_id: string
          generated_at?: string | null
          id?: string
          net_emissions?: number | null
          recommendations?: Json | null
          report_status?: string | null
          report_title?: string | null
          report_type?: string
          report_url?: string | null
          report_year: number
          total_avoided_via_platform?: number | null
          total_emissions?: number | null
          total_scope1?: number | null
          total_scope2?: number | null
          total_scope3?: number | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          emissions_per_employee?: number | null
          esg_data_id?: string
          generated_at?: string | null
          id?: string
          net_emissions?: number | null
          recommendations?: Json | null
          report_status?: string | null
          report_title?: string | null
          report_type?: string
          report_url?: string | null
          report_year?: number
          total_avoided_via_platform?: number | null
          total_emissions?: number | null
          total_scope1?: number | null
          total_scope2?: number | null
          total_scope3?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_reports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_reports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_reports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_reports_esg_data_id_fkey"
            columns: ["esg_data_id"]
            isOneToOne: false
            referencedRelation: "org_esg_data"
            referencedColumns: ["id"]
          },
        ]
      }
      external_activities: {
        Row: {
          account_id: string
          category: string
          created_at: string | null
          date_end: string | null
          date_start: string | null
          description: string | null
          document_path: string | null
          document_url: string | null
          id: string
          norms_impacted: string[] | null
          qualitative_value: string | null
          quantitative_unit: string | null
          quantitative_value: number | null
          subcategory: string
          title: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          account_id: string
          category: string
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          document_path?: string | null
          document_url?: string | null
          id?: string
          norms_impacted?: string[] | null
          qualitative_value?: string | null
          quantitative_unit?: string | null
          quantitative_value?: number | null
          subcategory: string
          title: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          account_id?: string
          category?: string
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          document_path?: string | null
          document_url?: string | null
          id?: string
          norms_impacted?: string[] | null
          qualitative_value?: string | null
          quantitative_unit?: string | null
          quantitative_value?: number | null
          subcategory?: string
          title?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: number
          invite_token: string
          invited_by: string
          role: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          invite_token?: string
          invited_by?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      listing_images: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          position: number
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          position?: number
          storage_path: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          position?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          account_id: string
          category_id: string
          created_at: string | null
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          listing_type: string
          location_city: string | null
          location_country: string | null
          location_postal_code: string | null
          material_details: string | null
          price_per_unit: number | null
          quantity: number
          status: string
          title: string
          transport_price: number | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          category_id: string
          created_at?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          listing_type?: string
          location_city?: string | null
          location_country?: string | null
          location_postal_code?: string | null
          material_details?: string | null
          price_per_unit?: number | null
          quantity: number
          status?: string
          title: string
          transport_price?: number | null
          unit?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          category_id?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          listing_type?: string
          location_city?: string | null
          location_country?: string | null
          location_postal_code?: string | null
          material_details?: string | null
          price_per_unit?: number | null
          quantity?: number
          status?: string
          title?: string
          transport_price?: number | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_config: {
        Row: {
          commission_rate: number
          currency: string
          escrow_release_delay_hours: number
          id: string
          min_payout_amount: number
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number
          currency?: string
          escrow_release_delay_hours?: number
          id?: string
          min_payout_amount?: number
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          currency?: string
          escrow_release_delay_hours?: number
          id?: string
          min_payout_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      marketplace_transactions: {
        Row: {
          blockchain_hash: string | null
          buyer_account_id: string
          buyer_signed: boolean
          buyer_signed_at: string | null
          cancelled_at: string | null
          carbon_record_id: string | null
          commission_config_id: string | null
          commission_rate: number
          contract_expires_at: string | null
          contract_id: string | null
          contract_pdf_path: string | null
          contract_sent_at: string | null
          contract_signed_pdf_path: string | null
          contract_signed_pdf_sha256: string | null
          contract_status: string | null
          created_at: string | null
          currency: string
          delivered_at: string | null
          delivery_confirmed_at: string | null
          delivery_status: string
          funds_released_at: string | null
          id: string
          in_transit_at: string | null
          listing_id: string
          paid_at: string | null
          payment_status: string
          platform_fee: number
          seller_account_id: string
          seller_amount: number
          seller_signed: boolean
          seller_signed_at: string | null
          shipped_at: string | null
          signature_envelope_id: string | null
          signature_provider: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          total_amount: number
          traceability_certificate_url: string | null
          transport_amount: number
          updated_at: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          buyer_account_id: string
          buyer_signed?: boolean
          buyer_signed_at?: string | null
          cancelled_at?: string | null
          carbon_record_id?: string | null
          commission_config_id?: string | null
          commission_rate?: number
          contract_expires_at?: string | null
          contract_id?: string | null
          contract_pdf_path?: string | null
          contract_sent_at?: string | null
          contract_signed_pdf_path?: string | null
          contract_signed_pdf_sha256?: string | null
          contract_status?: string | null
          created_at?: string | null
          currency?: string
          delivered_at?: string | null
          delivery_confirmed_at?: string | null
          delivery_status?: string
          funds_released_at?: string | null
          id?: string
          in_transit_at?: string | null
          listing_id: string
          paid_at?: string | null
          payment_status?: string
          platform_fee: number
          seller_account_id: string
          seller_amount: number
          seller_signed?: boolean
          seller_signed_at?: string | null
          shipped_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          total_amount: number
          traceability_certificate_url?: string | null
          transport_amount?: number
          updated_at?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          buyer_account_id?: string
          buyer_signed?: boolean
          buyer_signed_at?: string | null
          cancelled_at?: string | null
          carbon_record_id?: string | null
          commission_config_id?: string | null
          commission_rate?: number
          contract_expires_at?: string | null
          contract_id?: string | null
          contract_pdf_path?: string | null
          contract_sent_at?: string | null
          contract_signed_pdf_path?: string | null
          contract_signed_pdf_sha256?: string | null
          contract_status?: string | null
          created_at?: string | null
          currency?: string
          delivered_at?: string | null
          delivery_confirmed_at?: string | null
          delivery_status?: string
          funds_released_at?: string | null
          id?: string
          in_transit_at?: string | null
          listing_id?: string
          paid_at?: string | null
          payment_status?: string
          platform_fee?: number
          seller_account_id?: string
          seller_amount?: number
          seller_signed?: boolean
          seller_signed_at?: string | null
          shipped_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          total_amount?: number
          traceability_certificate_url?: string | null
          transport_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_buyer_account_id_fkey"
            columns: ["buyer_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_buyer_account_id_fkey"
            columns: ["buyer_account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_buyer_account_id_fkey"
            columns: ["buyer_account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_commission_config_id_fkey"
            columns: ["commission_config_id"]
            isOneToOne: false
            referencedRelation: "commission_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_seller_account_id_fkey"
            columns: ["seller_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_seller_account_id_fkey"
            columns: ["seller_account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_transactions_seller_account_id_fkey"
            columns: ["seller_account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      material_categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          name_fr: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          name_fr: string
          slug: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          name_fr?: string
          slug?: string
        }
        Relationships: []
      }
      material_sources: {
        Row: {
          annual_volume_tonnes: number | null
          category: string
          country: string
          created_at: string | null
          data_source: string
          data_source_url: string | null
          department: string | null
          id: string
          last_updated: string | null
          latitude: number | null
          longitude: number | null
          name: string
          price_currency: string | null
          price_per_tonne: number | null
          price_trend: string | null
          region: string
          source_type: string | null
          subcategory: string | null
        }
        Insert: {
          annual_volume_tonnes?: number | null
          category: string
          country?: string
          created_at?: string | null
          data_source: string
          data_source_url?: string | null
          department?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          price_currency?: string | null
          price_per_tonne?: number | null
          price_trend?: string | null
          region: string
          source_type?: string | null
          subcategory?: string | null
        }
        Update: {
          annual_volume_tonnes?: number | null
          category?: string
          country?: string
          created_at?: string | null
          data_source?: string
          data_source_url?: string | null
          department?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_currency?: string | null
          price_per_tonne?: number | null
          price_trend?: string | null
          region?: string
          source_type?: string | null
          subcategory?: string | null
        }
        Relationships: []
      }
      material_stats_by_region: {
        Row: {
          annual_volume_tonnes: number | null
          avg_price_per_tonne: number | null
          category: string
          country: string
          created_at: string | null
          data_source: string
          data_source_url: string | null
          id: string
          price_currency: string | null
          recovery_rate: number | null
          recycling_rate: number | null
          region: string
          year: number
        }
        Insert: {
          annual_volume_tonnes?: number | null
          avg_price_per_tonne?: number | null
          category: string
          country: string
          created_at?: string | null
          data_source: string
          data_source_url?: string | null
          id?: string
          price_currency?: string | null
          recovery_rate?: number | null
          recycling_rate?: number | null
          region: string
          year: number
        }
        Update: {
          annual_volume_tonnes?: number | null
          avg_price_per_tonne?: number | null
          category?: string
          country?: string
          created_at?: string | null
          data_source?: string
          data_source_url?: string | null
          id?: string
          price_currency?: string | null
          recovery_rate?: number | null
          recycling_rate?: number | null
          region?: string
          year?: number
        }
        Relationships: []
      }
      material_stats_national: {
        Row: {
          annual_volume_tonnes: number | null
          avg_price_per_tonne: number | null
          category: string
          country: string
          country_code: string
          created_at: string | null
          data_source: string
          data_source_url: string | null
          id: string
          landfill_rate: number | null
          price_currency: string | null
          recovery_rate: number | null
          recycling_rate: number | null
          year: number
        }
        Insert: {
          annual_volume_tonnes?: number | null
          avg_price_per_tonne?: number | null
          category: string
          country: string
          country_code: string
          created_at?: string | null
          data_source: string
          data_source_url?: string | null
          id?: string
          landfill_rate?: number | null
          price_currency?: string | null
          recovery_rate?: number | null
          recycling_rate?: number | null
          year: number
        }
        Update: {
          annual_volume_tonnes?: number | null
          avg_price_per_tonne?: number | null
          category?: string
          country?: string
          country_code?: string
          created_at?: string | null
          data_source?: string
          data_source_url?: string | null
          id?: string
          landfill_rate?: number | null
          price_currency?: string | null
          recovery_rate?: number | null
          recycling_rate?: number | null
          year?: number
        }
        Relationships: []
      }
      nonces: {
        Row: {
          client_token: string
          created_at: string
          expires_at: string
          id: string
          last_verification_at: string | null
          last_verification_ip: unknown
          last_verification_user_agent: string | null
          metadata: Json | null
          nonce: string
          purpose: string
          revoked: boolean
          revoked_reason: string | null
          scopes: string[] | null
          used_at: string | null
          user_id: string | null
          verification_attempts: number
        }
        Insert: {
          client_token: string
          created_at?: string
          expires_at: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce: string
          purpose: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Update: {
          client_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce?: string
          purpose?: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          account_id: string
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          dismissed: boolean
          expires_at: string | null
          id: number
          link: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          account_id: string
          body: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          account_id?: string
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_amount: number | null
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          order_id: string
          price_amount?: number | null
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_amount?: number | null
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      org_esg_data: {
        Row: {
          account_id: string
          created_at: string | null
          id: string
          industry_sector: string | null
          nb_employees: number | null
          office_surface_m2: number | null
          platform_co2_avoided: number | null
          platform_tonnes_recycled: number | null
          platform_transactions_count: number | null
          reporting_period: string | null
          reporting_year: number
          scope1_fuel_liters: number | null
          scope1_fuel_type: string | null
          scope1_natural_gas_kwh: number | null
          scope1_other_kg_co2: number | null
          scope2_electricity_kwh: number | null
          scope2_electricity_source: string | null
          scope2_heating_kwh: number | null
          scope3_business_travel_km: number | null
          scope3_commuting_avg_km: number | null
          scope3_commuting_employees: number | null
          scope3_purchased_goods_eur: number | null
          scope3_travel_mode: string | null
          scope3_waste_tonnes: number | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          id?: string
          industry_sector?: string | null
          nb_employees?: number | null
          office_surface_m2?: number | null
          platform_co2_avoided?: number | null
          platform_tonnes_recycled?: number | null
          platform_transactions_count?: number | null
          reporting_period?: string | null
          reporting_year: number
          scope1_fuel_liters?: number | null
          scope1_fuel_type?: string | null
          scope1_natural_gas_kwh?: number | null
          scope1_other_kg_co2?: number | null
          scope2_electricity_kwh?: number | null
          scope2_electricity_source?: string | null
          scope2_heating_kwh?: number | null
          scope3_business_travel_km?: number | null
          scope3_commuting_avg_km?: number | null
          scope3_commuting_employees?: number | null
          scope3_purchased_goods_eur?: number | null
          scope3_travel_mode?: string | null
          scope3_waste_tonnes?: number | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          id?: string
          industry_sector?: string | null
          nb_employees?: number | null
          office_surface_m2?: number | null
          platform_co2_avoided?: number | null
          platform_tonnes_recycled?: number | null
          platform_transactions_count?: number | null
          reporting_period?: string | null
          reporting_year?: number
          scope1_fuel_liters?: number | null
          scope1_fuel_type?: string | null
          scope1_natural_gas_kwh?: number | null
          scope1_other_kg_co2?: number | null
          scope2_electricity_kwh?: number | null
          scope2_electricity_source?: string | null
          scope2_heating_kwh?: number | null
          scope3_business_travel_km?: number | null
          scope3_commuting_avg_km?: number | null
          scope3_commuting_employees?: number | null
          scope3_purchased_goods_eur?: number | null
          scope3_travel_mode?: string | null
          scope3_waste_tonnes?: number | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_esg_data_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_esg_data_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_esg_data_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      org_sustainability_kpis: {
        Row: {
          account_id: string
          created_at: string | null
          id: string
          net_emissions_kg: number | null
          period_end: string
          period_start: string
          period_type: string | null
          tonnes_recycled: number | null
          total_avoided_kg: number | null
          total_emissions_kg: number | null
          transactions_count: number | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          id?: string
          net_emissions_kg?: number | null
          period_end: string
          period_start: string
          period_type?: string | null
          tonnes_recycled?: number | null
          total_avoided_kg?: number | null
          total_emissions_kg?: number | null
          transactions_count?: number | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          id?: string
          net_emissions_kg?: number | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          tonnes_recycled?: number | null
          total_avoided_kg?: number | null
          total_emissions_kg?: number | null
          transactions_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "org_sustainability_kpis_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_sustainability_kpis_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_sustainability_kpis_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_subscriptions: {
        Row: {
          account_id: string
          billing_cycle: string | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          traced_lots_this_month: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          traced_lots_this_month?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          traced_lots_this_month?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permissions"]
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      roles: {
        Row: {
          hierarchy_level: number
          name: string
        }
        Insert: {
          hierarchy_level: number
          name: string
        }
        Update: {
          hierarchy_level?: number
          name?: string
        }
        Relationships: []
      }
      stripe_connected_accounts: {
        Row: {
          account_id: string
          business_type: string | null
          charges_enabled: boolean | null
          country: string | null
          created_at: string | null
          id: string
          onboarding_complete: boolean | null
          payouts_enabled: boolean | null
          stripe_account_id: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          business_type?: string | null
          charges_enabled?: boolean | null
          country?: string | null
          created_at?: string | null
          id?: string
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          business_type?: string | null
          charges_enabled?: boolean | null
          country?: string | null
          created_at?: string | null
          id?: string
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_connected_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_connected_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_connected_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_items: {
        Row: {
          created_at: string
          id: string
          interval: string
          interval_count: number
          price_amount: number | null
          product_id: string
          quantity: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          interval: string
          interval_count: number
          price_amount?: number | null
          product_id: string
          quantity?: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval?: string
          interval_count?: number
          price_amount?: number | null
          product_id?: string
          quantity?: number
          subscription_id?: string
          type?: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          annual_price: number | null
          created_at: string | null
          display_name: string
          id: string
          includes_advanced_dashboard: boolean | null
          includes_api_access: boolean | null
          includes_dedicated_support: boolean | null
          includes_erp_integration: boolean | null
          is_active: boolean | null
          max_traced_lots_per_month: number | null
          monthly_price: number | null
          name: string
          pillar: string
          sort_order: number | null
          stripe_price_id_annual: string | null
          stripe_price_id_monthly: string | null
          stripe_product_id: string | null
        }
        Insert: {
          annual_price?: number | null
          created_at?: string | null
          display_name: string
          id?: string
          includes_advanced_dashboard?: boolean | null
          includes_api_access?: boolean | null
          includes_dedicated_support?: boolean | null
          includes_erp_integration?: boolean | null
          is_active?: boolean | null
          max_traced_lots_per_month?: number | null
          monthly_price?: number | null
          name: string
          pillar?: string
          sort_order?: number | null
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          annual_price?: number | null
          created_at?: string | null
          display_name?: string
          id?: string
          includes_advanced_dashboard?: boolean | null
          includes_api_access?: boolean | null
          includes_dedicated_support?: boolean | null
          includes_erp_integration?: boolean | null
          is_active?: boolean | null
          max_traced_lots_per_month?: number | null
          monthly_price?: number | null
          name?: string
          pillar?: string
          sort_order?: number | null
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at?: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          active?: boolean
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          id?: string
          period_ends_at?: string
          period_starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      traceability_certificates: {
        Row: {
          blockchain_hash: string | null
          blockchain_record_id: string
          carbon_record_id: string
          certificate_number: string
          certificate_url: string | null
          co2_avoided: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          issued_at: string | null
          issued_to_account_id: string
          material_summary: string | null
          transaction_id: string
          weight_tonnes: number | null
        }
        Insert: {
          blockchain_hash?: string | null
          blockchain_record_id: string
          carbon_record_id: string
          certificate_number: string
          certificate_url?: string | null
          co2_avoided?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_to_account_id: string
          material_summary?: string | null
          transaction_id: string
          weight_tonnes?: number | null
        }
        Update: {
          blockchain_hash?: string | null
          blockchain_record_id?: string
          carbon_record_id?: string
          certificate_number?: string
          certificate_url?: string | null
          co2_avoided?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issued_to_account_id?: string
          material_summary?: string | null
          transaction_id?: string
          weight_tonnes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traceability_certificates_blockchain_record_id_fkey"
            columns: ["blockchain_record_id"]
            isOneToOne: false
            referencedRelation: "blockchain_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traceability_certificates_carbon_record_id_fkey"
            columns: ["carbon_record_id"]
            isOneToOne: false
            referencedRelation: "carbon_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traceability_certificates_issued_to_account_id_fkey"
            columns: ["issued_to_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traceability_certificates_issued_to_account_id_fkey"
            columns: ["issued_to_account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traceability_certificates_issued_to_account_id_fkey"
            columns: ["issued_to_account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "traceability_certificates_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_events: {
        Row: {
          actor_account_id: string | null
          actor_role: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          transaction_id: string
        }
        Insert: {
          actor_account_id?: string | null
          actor_role?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          transaction_id: string
        }
        Update: {
          actor_account_id?: string | null
          actor_role?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_events_actor_account_id_fkey"
            columns: ["actor_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_events_actor_account_id_fkey"
            columns: ["actor_account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_events_actor_account_id_fkey"
            columns: ["actor_account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_emission_factors: {
        Row: {
          created_at: string | null
          emission_factor: number
          id: string
          is_active: boolean | null
          source: string | null
          transport_mode: string
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          emission_factor: number
          id?: string
          is_active?: boolean | null
          source?: string | null
          transport_mode: string
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          emission_factor?: number
          id?: string
          is_active?: boolean | null
          source?: string | null
          transport_mode?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          account_id: string
          available_balance: number
          currency: string
          id: string
          pending_balance: number
          total_commission_paid: number
          total_earned: number
          total_fees_paid: number
          total_transactions: number
          total_withdrawn: number
          updated_at: string | null
        }
        Insert: {
          account_id: string
          available_balance?: number
          currency?: string
          id?: string
          pending_balance?: number
          total_commission_paid?: number
          total_earned?: number
          total_fees_paid?: number
          total_transactions?: number
          total_withdrawn?: number
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          available_balance?: number
          currency?: string
          id?: string
          pending_balance?: number
          total_commission_paid?: number
          total_earned?: number
          total_fees_paid?: number
          total_transactions?: number
          total_withdrawn?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_balances_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_balances_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_balances_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_account_workspace: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          role: string | null
          slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args: { token: string; user_id: string }
        Returns: string
      }
      add_invitations_to_account: {
        Args: {
          account_slug: string
          invitations: Database["public"]["CompositeTypes"]["invitation"][]
          invited_by: string
        }
        Returns: Database["public"]["Tables"]["invitations"]["Row"][]
      }
      calculate_commission: {
        Args: { p_amount_cents: number; p_config_override?: string }
        Returns: {
          commission_amount: number
          commission_rate: number
          config_id: string
          config_name: string
          seller_amount: number
        }[]
      }
      calculate_transaction_carbon: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      can_action_account_member: {
        Args: { target_team_account_id: string; target_user_id: string }
        Returns: boolean
      }
      create_invitation: {
        Args: { account_id: string; email: string; role: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "invitations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_nonce: {
        Args: {
          p_expires_in_seconds?: number
          p_metadata?: Json
          p_purpose?: string
          p_revoke_previous?: boolean
          p_scopes?: string[]
          p_user_id?: string
        }
        Returns: Json
      }
      create_team_account: {
        Args: { account_name: string; account_slug?: string; user_id: string }
        Returns: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_personal_account: boolean
          name: string
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      generate_blockchain_record: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      get_account_invitations: {
        Args: { account_slug: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invited_by: string
          inviter_email: string
          inviter_name: string
          role: string
          updated_at: string
        }[]
      }
      get_account_members: {
        Args: { account_slug: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          id: string
          name: string
          picture_url: string
          primary_owner_user_id: string
          role: string
          role_hierarchy_level: number
          updated_at: string
          user_id: string
        }[]
      }
      get_config: { Args: never; Returns: Json }
      get_nonce_status: { Args: { p_id: string }; Returns: Json }
      get_upper_system_role: { Args: never; Returns: string }
      has_active_subscription: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      has_more_elevated_role: {
        Args: {
          role_name: string
          target_account_id: string
          target_user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          account_id: string
          permission_name: Database["public"]["Enums"]["app_permissions"]
          user_id: string
        }
        Returns: boolean
      }
      has_role_on_account: {
        Args: { account_id: string; account_role?: string }
        Returns: boolean
      }
      has_same_role_hierarchy_level: {
        Args: {
          role_name: string
          target_account_id: string
          target_user_id: string
        }
        Returns: boolean
      }
      increment_wallet_pending: {
        Args: { p_account_id: string; p_amount: number }
        Returns: undefined
      }
      is_aal2: { Args: never; Returns: boolean }
      is_account_owner: { Args: { account_id: string }; Returns: boolean }
      is_account_team_member: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      is_mfa_compliant: { Args: never; Returns: boolean }
      is_set: { Args: { field_name: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_team_member: {
        Args: { account_id: string; user_id: string }
        Returns: boolean
      }
      revoke_nonce: {
        Args: { p_id: string; p_reason?: string }
        Returns: boolean
      }
      team_account_workspace: {
        Args: { account_slug: string }
        Returns: {
          id: string
          name: string
          permissions: Database["public"]["Enums"]["app_permissions"][]
          picture_url: string
          primary_owner_user_id: string
          role: string
          role_hierarchy_level: number
          slug: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      transfer_team_account_ownership: {
        Args: { new_owner_id: string; target_account_id: string }
        Returns: undefined
      }
      upsert_order: {
        Args: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          currency: string
          line_items: Json
          status: Database["public"]["Enums"]["payment_status"]
          target_account_id: string
          target_customer_id: string
          target_order_id: string
          total_amount: number
        }
        Returns: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_subscription: {
        Args: {
          active: boolean
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          currency: string
          line_items: Json
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          target_account_id: string
          target_customer_id: string
          target_subscription_id: string
          trial_ends_at?: string
          trial_starts_at?: string
        }
        Returns: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verify_nonce: {
        Args: {
          p_ip?: unknown
          p_max_verification_attempts?: number
          p_purpose: string
          p_required_scopes?: string[]
          p_token: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_permissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
      billing_provider: "stripe" | "lemon-squeezy" | "paddle"
      notification_channel: "in_app" | "email"
      notification_type: "info" | "warning" | "error"
      payment_status: "pending" | "succeeded" | "failed"
      subscription_item_type: "flat" | "per_seat" | "metered"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
    }
    CompositeTypes: {
      invitation: {
        email: string | null
        role: string | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_permissions: [
        "roles.manage",
        "billing.manage",
        "settings.manage",
        "members.manage",
        "invites.manage",
      ],
      billing_provider: ["stripe", "lemon-squeezy", "paddle"],
      notification_channel: ["in_app", "email"],
      notification_type: ["info", "warning", "error"],
      payment_status: ["pending", "succeeded", "failed"],
      subscription_item_type: ["flat", "per_seat", "metered"],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
