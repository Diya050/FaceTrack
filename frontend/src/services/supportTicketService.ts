import api from "./../services/api";
import type { SupportTicket, TicketStatus } from "../types/supportTicket";

export const createTicket = async (payload: {
  subject: string;
  description: string;
}) => {
  const response = await api.post("/support-tickets", payload);
  return response.data;
};

export const getTickets = async (): Promise<SupportTicket[]> => {
  const response = await api.get<SupportTicket[]>(
    "/support-tickets"
  );

  return response.data;
};

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus
) => {

  const response = await api.patch(
    `/support-tickets/${ticketId}/status`,
    { status }
  );

  return response.data;
};


export const respondToTicket = async (ticketId: string, actionKey: string) => {
  const response = await api.post(`/support-tickets/${ticketId}/respond`, null, {
    params: { action_key: actionKey }
  });
  return response.data;
};