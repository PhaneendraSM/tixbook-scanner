"use client"

import { CheckCircle2, XCircle, AlertTriangle, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { VerificationResult } from "@/lib/types";

type StatusDisplayProps = {
  result: VerificationResult;
  onReset: () => void;
};

const statusConfig = {
  valid: {
    icon: CheckCircle2,
    title: "Valid Ticket",
    cardClass: "bg-success/10 border-success text-success",
  },
  already_scanned: {
    icon: History,
    title: "Already Scanned",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
  },
  invalid: {
    icon: XCircle,
    title: "Invalid Ticket",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
  },
  error: {
    icon: AlertTriangle,
    title: "Verification Error",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
  },
};

export function StatusDisplay({ result, onReset }: StatusDisplayProps) {
  const config = statusConfig[result.status];

  if (!config) {
    console.error("Invalid verification status received:", result.status);
    return (
        <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
             <Card className="text-center bg-destructive/10 border-destructive text-destructive">
                <CardHeader className="p-6">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="w-20 h-20" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Error</CardTitle>
                    <CardDescription className="text-lg text-current">An unknown error occurred.</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center p-6 pt-0">
                    <Button onClick={onReset} size="lg" className="w-full">Scan Again</Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      <Card className={cn("text-center", config.cardClass)}>
        <CardHeader className="p-6">
          <div className="flex justify-center mb-4">
            <Icon className={cn("w-20 h-20")} />
          </div>
          <CardTitle className="text-3xl font-bold">{config.title}</CardTitle>
          <CardDescription className="text-lg text-current">{result.message}</CardDescription>
        </CardHeader>
        {result.ticket && (
          <CardContent className="text-left space-y-2 p-6 pt-0 text-card-foreground">
            <div className="border-t pt-4 space-y-1">
              <p><strong>Event:</strong> {result.ticket.eventName}</p>
              <p><strong>Ticket Type:</strong> {result.ticket.ticketType}</p>
              <p><strong>Name:</strong> {result.ticket.ownerName}</p>
              {result.ticket.scannedAt && (
                 <p><strong>Scanned At:</strong> {new Date(result.ticket.scannedAt).toLocaleString()}</p>
              )}
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button onClick={onReset} size="lg" className="w-full">Scan Next Ticket</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
