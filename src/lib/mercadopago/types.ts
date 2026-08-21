export interface CreatePixPaymentInput {
  amount: number;
  description: string;
  externalReference: string;
  payerEmail?: string;
}

export interface CreatePixPaymentResult {
  mercadoPagoPaymentId: string;
  status: string;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
}

export interface MpPaymentResponse {
  id: number;
  status: string;
  external_reference?: string | null;
  transaction_amount?: number;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
}
