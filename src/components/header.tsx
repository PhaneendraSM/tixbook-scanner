"use client"
import { User, QrCode } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <QrCode className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">Ticket Validator</h1>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <User className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground">Staff:</span>
        <span className="font-medium">Alex Ray</span>
      </div>
    </header>
  );
}
