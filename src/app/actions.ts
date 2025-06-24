"use server";
import { findTicketById, useTicket } from "@/lib/tickets";
import type { VerificationResult } from "@/lib/types";

export async function verifyTicket(ticketId: string): Promise<VerificationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  const ticket = findTicketById(ticketId);

  if (!ticket) {
    return {
      status: 'invalid',
      message: 'This ticket does not exist.',
    };
  }

  if (ticket.isUsed) {
    return {
      status: 'already_scanned',
      message: 'This ticket has already been used.',
      ticket: {
        id: ticket.id,
        eventName: ticket.eventName,
        ticketType: ticket.ticketType,
        ownerName: ticket.ownerName,
        scannedAt: ticket.scannedAt,
      },
    };
  }
  
  const usedTicket = useTicket(ticketId);

  if (usedTicket) {
    return {
      status: 'valid',
      message: 'Entry Allowed',
      ticket: {
        id: usedTicket.id,
        eventName: usedTicket.eventName,
        ticketType: usedTicket.ticketType,
        ownerName: usedTicket.ownerName,
        scannedAt: usedTicket.scannedAt,
      },
    };
  }
  
  // This case should not be reached with current logic, but as a fallback
  return {
    status: 'error',
    message: 'An unexpected error occurred during verification.'
  }
}
