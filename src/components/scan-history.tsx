"use client"

import { Check, X, History as HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ScanHistoryItem } from "@/lib/types";

const statusIcons = {
  valid: { icon: Check, className: "bg-success text-success-foreground" },
  invalid: { icon: X, className: "bg-destructive text-destructive-foreground" },
  already_scanned: { icon: HistoryIcon, className: "bg-destructive text-destructive-foreground" },
  error: { icon: X, className: "bg-destructive text-destructive-foreground" },
};

export function ScanHistory({ history }: { history: ScanHistoryItem[] }) {
  if (history.length === 0) {
    return (
        <div className="w-full max-w-md mx-auto mt-8 text-center text-muted-foreground">
            <p>No tickets scanned yet.</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-4 pr-4">
            {history.map((item, index) => {
              const IconConfig = statusIcons[item.status];
              const Icon = IconConfig.icon;
              return (
                <div key={index}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", IconConfig.className)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold truncate">{item.ticketId}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {index < history.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
