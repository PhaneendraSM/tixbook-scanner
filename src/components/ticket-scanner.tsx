"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

type TicketScannerProps = {
  onScan: (result: string) => void;
  onError: (error: Error) => void;
};

export function TicketScanner({ onScan, onError }: TicketScannerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const handleScan = useCallback((result: Result) => {
    if (result && result.getText() && !isScanning) {
      console.log("QR Code detected:", result.getText());
      setIsScanning(true);
      onScan(result.getText());
      
      // Reset scanning state after a delay
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    }
  }, [onScan, isScanning]);

  const handleError = useCallback((error: any) => {
    console.error("QR Scanner Error:", error);
    
    // Don't show temporary initialization errors or errors that don't affect functionality
    if (error.name === 'NotAllowedError') {
      setHasError(true);
      onError(new Error("Camera access denied. Please allow camera permissions."));
    } else if (error.name === 'NotFoundError') {
      setHasError(true);
      onError(new Error("No camera found on this device."));
    } else if (error.name === 'NotSupportedError') {
      setHasError(true);
      onError(new Error("Camera not supported on this device."));
    } else if (error.name === 'NotReadableError') {
      setHasError(true);
      onError(new Error("Camera is already in use by another application."));
    } else if (error.name === 'OverconstrainedError') {
      setHasError(true);
      onError(new Error("Camera constraints not supported."));
    } else if (error.name === 'TypeError' || error.name === 'SyntaxError') {
      // This is usually a temporary initialization error, ignore it
      console.log("Ignoring temporary initialization error:", error.message);
      return;
    } else if (error.name === 'NotFoundException') {
      // This is normal - no QR code found, not an error
      console.log("No QR code found in frame");
      return;
    } else if (error.message && (
      error.message.includes('initialization') || 
      error.message.includes('Failed to initialize') ||
      error.message.includes('Camera initialization failed')
    )) {
      // Only log initialization errors, don't show to user if scanner is working
      console.log("Camera initialization warning (scanner may still work):", error.message);
      return;
    } else {
      // For other errors, only show if they're persistent
      console.log("Scanner warning (may be temporary):", error.message);
      return;
    }
  }, [onError]);

  useEffect(() => {
    if (!videoRef.current) return;

    const initializeScanner = async () => {
      try {
        // Create new reader instance
        readerRef.current = new BrowserMultiFormatReader();
        
        // Get available video devices
        const videoInputDevices = await readerRef.current.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          throw new Error("No camera devices found");
        }

        // Start scanning with the first available camera
        await readerRef.current.decodeFromVideoDevice(
          videoInputDevices[0].deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleScan(result);
            }
            if (error && error.name !== 'NotFoundException') {
              handleError(error);
            }
          }
        );

        // Mark as initialized after a short delay
        setTimeout(() => {
          setIsInitialized(true);
        }, 1000);

      } catch (error) {
        console.error("Failed to initialize scanner:", error);
        handleError(error);
      }
    };

    initializeScanner();

    // Cleanup function
    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (error) {
          console.error("Error resetting scanner:", error);
        }
        readerRef.current = null;
      }
    };
  }, [handleScan, handleError]);

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-lg border-4 border-muted/50">
      {!isInitialized && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 z-10">
          <div className="text-center p-4">
            <p className="text-sm text-destructive mb-2">Camera Error</p>
            <p className="text-xs text-muted-foreground">Please check camera permissions and refresh the page</p>
          </div>
        </div>
      )}

      {/* Video element for camera stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        style={{ 
          display: isInitialized && !hasError ? 'block' : 'none'
        }}
      />

      {/* Custom overlay for better UX */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />
        
        {/* Animated scanning line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-scan shadow-[0_0_10px_hsl(var(--primary))]" />
        
        {/* Scanning indicator */}
        {isScanning && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}
