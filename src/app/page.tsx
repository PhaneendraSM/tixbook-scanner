"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { verifyTicket } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { ScanHistoryItem, VerificationResult } from "@/lib/types";

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

    try {
      const result = await verifyTicket(scannedData);
      setVerificationResult(result);

      // Add to history
      const historyItem: ScanHistoryItem = {
        ...result,
        ticketId: scannedData,
        timestamp: new Date(),
      };
      setScanHistory((prevHistory) => [historyItem, ...prevHistory]);

    } catch (error) {
      console.error(error);
      const errorResult: VerificationResult = {
        status: 'error',
        message: 'Network error or server unavailable.',
      }
      setVerificationResult(errorResult);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the verification server.",
      });
    } finally {
      setIsLoading(false);
    }
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
