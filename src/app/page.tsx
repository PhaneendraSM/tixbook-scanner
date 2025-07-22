"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScanHistoryItem, VerificationResult, VerificationStatus } from "@/lib/types";
import { cn, extractBookingId } from "@/lib/utils";
import { createAuthAxios } from "@/lib/auth";
import { Header } from "@/components/header";
import { TicketScanner } from "@/components/ticket-scanner";
import { StatusDisplay } from "@/components/status-display";
import { ScanHistory } from "@/components/scan-history";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [scannerKey, setScannerKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const processScan = useCallback(async (scannedData: string) => {
    setIsLoading(true);

    // Extract booking ID from QR code data
    const bookingId = extractBookingId(scannedData);
    
    if (!bookingId) {
      const result: VerificationResult = {
        status: 'invalid',
        message: 'Invalid QR code format. Expected tixbook.com booking URL.',
      };
      
      setVerificationResult(result);
      const historyItem: ScanHistoryItem = {
        ...result,
        ticketId: scannedData,
        timestamp: new Date(),
      };
      setScanHistory((prevHistory) => [historyItem, ...prevHistory]);
      setIsLoading(false);
      return;
    }

    try {
      // Call the API to validate the booking using authenticated axios instance
      const authAxios = createAuthAxios();
      const response = await authAxios.get(`/api/booking/validate/${bookingId}`);
      
      // Map the API response to our VerificationResult format
      const apiResult = response.data;
      console.log("API Result:", apiResult);
      
      // Handle the API response status and messages appropriately
      let status: VerificationStatus = 'valid';
      let message = apiResult.message || 'Ticket validated successfully';
      
      // Check for the specific "QR code already validated" message
      if (apiResult.message === 'QR code already validated.') {
        status = 'already_scanned';
        message = apiResult.message;
      } else if (apiResult.status === 'already_scanned') {
        status = 'already_scanned';
        message = apiResult.message || 'This ticket has already been used.';
      } else if (apiResult.status === 'invalid') {
        status = 'invalid';
        message = apiResult.message || 'This ticket is invalid.';
      } else if (apiResult.status === 'error') {
        status = 'error';
        message = apiResult.message || 'An error occurred during verification.';
      }
      
      const result: VerificationResult = {
        status,
        message,
        bookingId: apiResult.bookingId || bookingId,
        ticket: apiResult.ticket,
      };
      
      console.log("Verification Result:", result);
      setVerificationResult(result);

      const historyItem: ScanHistoryItem = {
        ...result,
        ticketId: bookingId,
        timestamp: new Date(),
      };
      setScanHistory((prevHistory) => [historyItem, ...prevHistory]);

    } catch (error: any) {
      console.error('Error validating booking:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      
      // Check if this is a 400 error with "QR code already validated" message
      if (error.response?.status === 400 && error.response?.data?.message === 'QR code already validated.') {
        const result: VerificationResult = {
          status: 'already_scanned',
          message: 'QR code already validated.',
          bookingId: bookingId,
        };
        
        console.log("Handling already validated QR code:", result);
        setVerificationResult(result);
        const historyItem: ScanHistoryItem = {
          ...result,
          ticketId: bookingId,
          timestamp: new Date(),
        };
        setScanHistory((prevHistory) => [historyItem, ...prevHistory]);
      } else {
        // Handle other errors
        const result: VerificationResult = {
          status: 'error',
          message: 'Failed to validate ticket. Please try again.',
        };
        
        setVerificationResult(result);
        const historyItem: ScanHistoryItem = {
          ...result,
          ticketId: scannedData,
          timestamp: new Date(),
        };
        setScanHistory((prevHistory) => [historyItem, ...prevHistory]);
      }
    }

    setIsLoading(false);
    console.log("--- SCAN COMPLETE ---");
  }, []);

  const handleScan = useCallback((scannedData: string | null) => {
    // Some versions of the library can return null, so we check for that.
    if (!scannedData) return;

    console.log("--- SCAN DETECTED ---");
    console.log("Scanned Data:", scannedData);

    // This check is crucial to prevent the scanner from re-triggering while a result is shown
    if (isLoading || verificationResult || isResetting) {
      console.log("Scan ignored: Already processing, showing result, or resetting.");
      return;
    }
    
    // Defer the processing to prevent race conditions with the scanner component
    setTimeout(() => processScan(scannedData), 0);
  }, [isLoading, verificationResult, isResetting, processScan]);

  const handleReset = useCallback(() => {
    console.log("Resetting scanner state...");
    setIsResetting(true);
    setVerificationResult(null);
    
    // Simple delay before re-mounting the scanner
    setTimeout(() => {
      setScannerKey(prevKey => prevKey + 1);
      setIsResetting(false);
    }, 500);
  }, []);

  const handleScannerError = useCallback((error: Error) => {
    console.error("Scanner Error:", error);
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: error.message || "Could not access the camera. Please check permissions.",
    });
  }, [toast]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 flex flex-col items-center p-4 space-y-6">
          <div className="w-full max-w-md flex flex-col items-center justify-center pt-8 min-h-[28rem]">
            
            {/* Scanner View: Hidden when loading, showing result, or resetting */}
            <div className={cn("w-full text-center animate-in fade-in", { 
              'hidden': isLoading || verificationResult || isResetting 
            })}>
              <TicketScanner 
                key={scannerKey} 
                onScan={handleScan} 
                onError={handleScannerError} 
              />
              <p className="text-muted-foreground mt-4">Point the camera at a QR code to scan it.</p>
               {/* <Button variant="link" asChild className="mt-2">
                 <Link href="/tickets">
                    View Sample Bookings
                 </Link>
               </Button> */}
            </div>

            {/* Loading View */}
            {isLoading && (
              <div className="flex flex-col items-center gap-4 text-primary animate-in fade-in">
                <Loader2 className="w-16 h-16 animate-spin" />
                <p className="text-lg font-semibold">Verifying Ticket...</p>
              </div>
            )}

            {/* Resetting View */}
            {isResetting && (
              <div className="flex flex-col items-center gap-4 text-primary animate-in fade-in">
                <Loader2 className="w-16 h-16 animate-spin" />
                <p className="text-lg font-semibold">Resetting Scanner...</p>
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
    </ProtectedRoute>
  );
}
