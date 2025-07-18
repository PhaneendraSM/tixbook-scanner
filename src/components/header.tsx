"use client"
import { User, QrCode, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import tixbookLogo from "@/assets/images/tixbook-white.png";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        {/* <QrCode className="w-8 h-8 text-primary" /> */}
        <Image src={tixbookLogo} alt="Logo" width={150} height={150} />
        <h1 className="text-xl font-bold tracking-tight">Ticket Validator</h1>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <User className="w-5 h-5 text-muted-foreground" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 font-medium">
              {user?.name || "Unknown User"}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
