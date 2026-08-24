// Gerado manualmente a partir das migrations em supabase/migrations/ — sem
// CLI linkado neste ambiente para rodar `supabase gen types`. As tabelas
// vivem no schema "caixa_time" (nao "public") porque o projeto Supabase e
// compartilhado com outro produto do usuario — ver README. Assim que
// houver CLI linkado, substituir por:
//   supabase gen types typescript --linked --schema caixa_time > src/lib/supabase/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type PaymentType = "mensalidade" | "caixinha";
export type PaymentStatus = "pending" | "paid" | "cancelled";
export type PlayerPosition = "goleiro" | "zagueiro" | "lateral" | "volante" | "meia" | "atacante";

export interface Database {
  caixa_time: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      team_settings: {
        Row: {
          id: number;
          team_name: string;
          default_mensalidade_amount: number;
          banner_image_url: string | null;
          crest_image_url: string | null;
          top_banner_url: string | null;
          pickup_game_banner_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          team_name?: string;
          default_mensalidade_amount?: number;
          banner_image_url?: string | null;
          crest_image_url?: string | null;
          top_banner_url?: string | null;
          pickup_game_banner_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          team_name?: string;
          default_mensalidade_amount?: number;
          banner_image_url?: string | null;
          crest_image_url?: string | null;
          top_banner_url?: string | null;
          pickup_game_banner_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          position: PlayerPosition | null;
          photo_url: string | null;
          birth_date: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          position?: PlayerPosition | null;
          photo_url?: string | null;
          birth_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          position?: PlayerPosition | null;
          photo_url?: string | null;
          birth_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          player_id: string;
          type: PaymentType;
          amount: number;
          reference_month: string | null;
          status: PaymentStatus;
          mercado_pago_payment_id: string | null;
          pix_qr_code: string | null;
          pix_copy_paste: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          type: PaymentType;
          amount: number;
          reference_month?: string | null;
          status?: PaymentStatus;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          type?: PaymentType;
          amount?: number;
          reference_month?: string | null;
          status?: PaymentStatus;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      pickup_game_contributions: {
        Row: {
          id: string;
          amount: number;
          status: PaymentStatus;
          contributor_name: string | null;
          mercado_pago_payment_id: string | null;
          pix_qr_code: string | null;
          pix_copy_paste: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          status?: PaymentStatus;
          contributor_name?: string | null;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          status?: PaymentStatus;
          contributor_name?: string | null;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      jersey_wash_contributions: {
        Row: {
          id: string;
          amount: number;
          status: PaymentStatus;
          contributor_name: string | null;
          mercado_pago_payment_id: string | null;
          pix_qr_code: string | null;
          pix_copy_paste: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          status?: PaymentStatus;
          contributor_name?: string | null;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          status?: PaymentStatus;
          contributor_name?: string | null;
          mercado_pago_payment_id?: string | null;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      withdrawals: {
        Row: {
          id: string;
          description: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          website_url: string | null;
          logo_url: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website_url?: string | null;
          logo_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          website_url?: string | null;
          logo_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
