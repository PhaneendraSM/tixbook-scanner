
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScanHistoryItem, VerificationResult } from "@/lib/types";
import { findTicketById, useTicket } from "@/lib/tickets";
import { cn } from "@/lib/utils";

import { Header } from "@/components/header";
import { TicketScanner } from "@/components/ticket-scanner";
import { StatusDisplay } from "@/components/status-display";
import { ScanHistory } from "@/components/scan-history";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [scannerKey, setScannerKey] = useState(0); // Add a key to force re-mounting
  const { toast } = useToast();

  const processScan = (scannedData: string) => {
    setIsLoading(true);

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
        // This case should ideally not be reached if findTicketById works
        result = {
          status: 'error',
          message: 'An unexpected error occurred during verification.'
        }
      }
    }
    
    console.log("Verification Result:", result);
    setVerificationResult(result);

    const historyItem: ScanHistoryItem = {
      ...result,
      ticketId: scannedData,
      timestamp: new Date(),
    };
    setScanHistory((prevHistory) => [historyItem, ...prevHistory]);

    setIsLoading(false);
    console.log("--- SCAN COMPLETE ---");
  };

  const handleScan = (scannedData: string | null) => {
    // Some versions of the library can return null, so we check for that.
    if (!scannedData) return;

    console.log("--- SCAN DETECTED ---");
    console.log("Scanned Data:", scannedData);

    // This check is crucial to prevent the scanner from re-triggering while a result is shown
    if (isLoading || verificationResult) {
      console.log("Scan ignored: Already processing or showing a result.");
      return;
    }
    
    // Defer the processing to prevent race conditions with the scanner component
    setTimeout(() => processScan(scannedData), 0);
  };

  const handleReset = () => {
    console.log("Resetting scanner state...");
    setVerificationResult(null);
    setScannerKey(prevKey => prevKey + 1); // Increment key to force re-mount
  };
  
  const handleScannerError = (error: Error) => {
    console.error("Scanner Error:", error);
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
        <div className="w-full max-w-md flex flex-col items-center justify-center pt-8 min-h-[28rem]">
          
          {/* Scanner View: Hidden when loading or showing a result */}
          <div className={cn("w-full text-center animate-in fade-in", { 'hidden': isLoading || verificationResult })}>
            <TicketScanner 
              key={scannerKey} 
              onScan={handleScan} 
              onError={handleScannerError} 
            />
            <p className="text-muted-foreground mt-4">Point the camera at a QR code to scan it.</p>
             <Button variant="link" asChild className="mt-2">
               <Link href="/tickets">
                  View Sample Tickets
               </Link>
             </Button>
          </div>

          {/* Loading View */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-primary animate-in fade-in">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p className="text-lg font-semibold">Verifying Ticket...</p>
            </div>
          )}

          {/* Result View */}
          {verificationResult && (
            <StatusDisplay result={verificationResult} onReset={handleReset} />
          )}

        </div>
        <ScanHistory history={scanHistory} />
      </main>
    </div>
  );
}
