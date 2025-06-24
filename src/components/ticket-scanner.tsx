"use client";

import { Scanner, type IResult } from "@yudiel/react-qr-scanner";

type TicketScannerProps = {
  onScan: (result: string) => void;
  onError: (error: Error) => void;
};

export function TicketScanner({ onScan, onError }: TicketScannerProps) {
  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-lg border-4 border-muted/50">
      <Scanner
        onResult={(result: IResult) => onScan(result.text)}
        onError={onError}
        containerStyle={{ width: "100%", height: "100%", paddingTop: '0' }}
        videoStyle={{ width: "100%", height: "100%", objectFit: 'cover' }}
      />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />
        
        {/* Animated scanning line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-scan shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>
    </div>
  );
}
