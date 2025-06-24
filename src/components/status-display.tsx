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
    titleClass: "text-success-foreground"
  },
  already_scanned: {
    icon: History,
    title: "Already Scanned",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
    titleClass: "text-destructive-foreground"
  },
  invalid: {
    icon: XCircle,
    title: "Invalid Ticket",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
    titleClass: "text-destructive-foreground"
  },
  error: {
    icon: AlertTriangle,
    title: "Verification Error",
    cardClass: "bg-destructive/10 border-destructive text-destructive",
    titleClass: "text-destructive-foreground"
  },
};

export function StatusDisplay({ result, onReset }: StatusDisplayProps) {
  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      <Card className={cn("text-center", config.cardClass)}>
        <CardHeader className="p-6">
          <div className="flex justify-center mb-4">
            <Icon className={cn("w-20 h-20")} />
          </div>
          <CardTitle className={cn("text-3xl font-bold", result.status === 'valid' ? 'text-green-800' : 'text-red-800', 'dark:text-white')}>{config.title}</CardTitle>
          <CardDescription className={cn("text-lg", result.status === 'valid' ? 'text-green-700' : 'text-red-700', 'dark:text-white/80')}>{result.message}</CardDescription>
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
