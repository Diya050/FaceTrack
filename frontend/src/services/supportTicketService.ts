import api from "./../services/api";
import type { SupportTicket, TicketStatus } from "../types/supportTicket";

export const createTicket = async (payload: {
  subject: string;
  description: string;
}) => {
  const response = await api.post("/support-tickets", payload);
  return response.data;
};

export const getTickets = async (
  status?: TicketStatus
): Promise<SupportTicket[]> => {

  const response = await api.get("/support-tickets", {
    params: { status }
  });

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