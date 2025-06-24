"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScanHistoryItem, VerificationResult } from "@/lib/types";
import { findTicketById, useTicket } from "@/lib/tickets";

import { Header } from "@/components/header";
import { TicketScanner } from "@/components/ticket-scanner";
import { StatusDisplay } from "@/components/status-display";
import { ScanHistory } from "@/components/scan-history";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const { toast } = useToast();

  const handleScan = async (scannedData: string) => {
    if (isLoading || verificationResult) return;

    setIsLoading(true);

    // Mock backend logic directly on the client to bypass "use server" issue.
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency

    let result: VerificationResult;
    const ticket = findTicketById(scannedData);

    if (!ticket) {
      result = {
        status: 'invalid',
        message: 'This ticket does not exist.',
      };
    } else if (ticket.isUsed) {
      result = {
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
    } else {
      const usedTicket = useTicket(scannedData);
      if (usedTicket) {
        result = {
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
      } else {
        // This case should not be reached with current logic, but as a fallback
        result = {
          status: 'error',
          message: 'An unexpected error occurred during verification.'
        }
      }
    }
    
    setVerificationResult(result);

    // Add to history
    const historyItem: ScanHistoryItem = {
      ...result,
      ticketId: scannedData,
      timestamp: new Date(),
    };
    setScanHistory((prevHistory) => [historyItem, ...prevHistory]);

    setIsLoading(false);
  };

  const handleReset = () => {
    setVerificationResult(null);
  };
  
  const handleScannerError = (error: Error) => {
    console.error(error);
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: error.message || "Could not access the camera. Please check permissions.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 space-y-6">
        <div className="w-full max-w-md flex items-center justify-center pt-8 min-h-[28rem]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-primary animate-in fade-in">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p className="text-lg font-semibold">Verifying Ticket...</p>
            </div>
          ) : verificationResult ? (
            <StatusDisplay result={verificationResult} onReset={handleReset} />
          ) : (
            <div className="flex flex-col items-center text-center gap-4 w-full">
               <TicketScanner onScan={handleScan} onError={handleScannerError} />
               <p className="text-muted-foreground mt-4">Point your camera at a ticket's QR code.</p>
            </div>
          )}
        </div>
        <ScanHistory history={scanHistory} />
      </main>
    </div>
  );
}
