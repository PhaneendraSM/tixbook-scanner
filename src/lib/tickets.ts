import type { Ticket } from '@/lib/types';

// In-memory store for tickets. In a real app, this would be a database.
const tickets: Map<string, Ticket> = new Map([
  [
    'TICKET-12345',
    {
      id: 'TICKET-12345',
      eventName: 'Starlight Music Festival',
      ticketType: 'VIP Access',
      ownerName: 'Jane Doe',
      isUsed: false,
      scannedAt: null,
    },
  ],
  [
    'TICKET-67890',
    {
      id: 'TICKET-67890',
      eventName: 'Starlight Music Festival',
      ticketType: 'General Admission',
      ownerName: 'John Smith',
      isUsed: false,
      scannedAt: null,
    },
  ],
  [
    'TICKET-ABCDE',
    {
      id: 'TICKET-ABCDE',
      eventName: 'Tech Conference 2024',
      ticketType: 'Full Pass',
      ownerName: 'Alice Johnson',
      isUsed: true,
      scannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Scanned 2 hours ago
    },
  ],
]);

// NOTE: This module should only be used on the server (e.g., in Server Actions).

/**
 * Finds a ticket by its ID without changing its state.
 * @param id The ID of the ticket to find.
 * @returns The ticket if found, otherwise undefined.
 */
export const findTicketById = (id: string): Ticket | undefined => {
  return tickets.get(id);
};

/**
 * Marks a ticket as used and returns it.
 * This simulates a secure, atomic update in a database.
 * @param id The ID of the ticket to use.
 * @returns The updated ticket if it was successfully marked as used, otherwise undefined.
 */
export const useTicket = (id:string): Ticket | undefined => {
    const ticket = tickets.get(id);
    if(ticket && !ticket.isUsed) {
        const updatedTicket = { ...ticket, isUsed: true, scannedAt: new Date()};
        tickets.set(id, updatedTicket);
        return updatedTicket;
    }
    return undefined;
}
