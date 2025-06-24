
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, QrCode, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScanHistoryItem, VerificationResult } from "@/lib/types";
import { findTicketById, useTicket } from "@/lib/tickets";

import { Header } from "@/components/header";
import { TicketScanner } from "@/components/ticket-scanner";
import { StatusDisplay } from "@/components/status-display";
import { ScanHistory } from "@/components/scan-history";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [scannerActive, setScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const { toast } = useToast();

  const handleScan = (scannedData: string) => {
    console.log("--- SCAN DETECTED ---");
    console.log("Scanned Data:", scannedData);

    if (isLoading || verificationResult) {
      console.log("Scan ignored: Already processing or showing a result.");
      return;
    }

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

  const handleReset = () => {
    console.log("Resetting scanner state...");
    setVerificationResult(null);
    setScannerActive(false);
  };
  
  const handleScannerError = (error: Error) => {
    console.error("Scanner Error:", error);
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: error.message || "Could not access the camera. Please check permissions.",
    });
    setScannerActive(false);
  };

  const renderScannerContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-4 text-primary animate-in fade-in">
          <Loader2 className="w-16 h-16 animate-spin" />
          <p className="text-lg font-semibold">Verifying Ticket...</p>
        </div>
      );
    }

    if (verificationResult) {
      return <StatusDisplay result={verificationResult} onReset={handleReset} />;
    }
    
    return (
        <div className="flex flex-col items-center text-center gap-4 w-full">
            <TicketScanner onScan={handleScan} onError={handleScannerError} />
            <p className="text-muted-foreground mt-4">Point your camera at a ticket's QR code.</p>
            <Button variant="outline" onClick={() => setScannerActive(false)}>
                Cancel
            </Button>
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 space-y-6">
        <div className="w-full max-w-md flex items-center justify-center pt-8 min-h-[28rem]">
          {scannerActive ? (
            renderScannerContent()
          ) : (
            <div className="flex flex-col items-center text-center gap-6 animate-in fade-in">
                <Camera className="w-24 h-24 text-primary/50" />
                <h2 className="text-2xl font-semibold">Ready to Scan</h2>
                <p className="text-muted-foreground max-w-sm">
                    Press the button below to activate the camera and start scanning tickets.
                </p>
                <Button size="lg" onClick={() => setScannerActive(true)}>
                   <QrCode className="mr-2 h-5 w-5"/>
                   Activate Scanner
                </Button>
                 <Button variant="link" asChild>
                   <Link href="/tickets">
                      View Sample Tickets
                   </Link>
                 </Button>
            </div>
          )}
        </div>
        <ScanHistory history={scanHistory} />
      </main>
    </div>
  );
}
