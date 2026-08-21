// Gerado manualmente a partir de supabase/migrations/0001_init.sql —
// nao ha projeto Supabase hospedado ainda para rodar `supabase gen types`.
// Assim que o projeto for criado e a migration aplicada, substituir por:
//   supabase gen types typescript --linked > src/lib/supabase/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type PaymentType = "mensalidade" | "caixinha";
export type PaymentStatus = "pending" | "paid" | "cancelled";

export interface Database {
  public: {
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
          updated_at: string;
        };
        Insert: {
          id?: number;
          team_name?: string;
          default_mensalidade_amount?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          team_name?: string;
          default_mensalidade_amount?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
