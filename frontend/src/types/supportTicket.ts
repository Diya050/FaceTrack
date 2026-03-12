export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

export interface SupportTicket {
  ticket_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  created_at: string;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
}