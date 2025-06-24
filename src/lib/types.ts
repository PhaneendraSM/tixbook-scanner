export interface Ticket {
  id: string;
  eventName: string;
  ticketType: string;
  ownerName: string;
  isUsed: boolean;
  scannedAt: Date | null;
}

export type VerificationStatus = 'valid' | 'invalid' | 'already_scanned' | 'error';

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  ticket?: Omit<Ticket, 'isUsed'>;
}

export interface ScanHistoryItem extends VerificationResult {
  timestamp: Date;
  ticketId: string;
}
