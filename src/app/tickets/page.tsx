import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TicketsPage() {
  const tickets = [
    {
      id: 'TICKET-12345',
      title: 'Valid Ticket',
      description: 'This ticket has not been used yet.',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-12345'
    },
    {
      id: 'TICKET-ABCDE',
      title: 'Already Scanned Ticket',
      description: 'This ticket has already been marked as used.',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-ABCDE'
    },
    {
      id: 'INVALID-QR-CODE',
      title: 'Invalid Ticket',
      description: 'This ticket ID does not exist in the system.',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INVALID-QR-CODE'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 sm:p-6">
      <header className="flex items-center mb-6">
        <Button asChild variant="outline" size="icon" className="mr-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Scanner</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Sample QR Codes</h1>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="text-center">
              <CardHeader>
                <CardTitle>{ticket.title}</CardTitle>
                <CardDescription>{ticket.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-2 bg-white rounded-lg">
                   <Image
                      src={ticket.qrUrl}
                      alt={`QR code for ${ticket.id}`}
                      width={200}
                      height={200}
                      data-ai-hint="qr code"
                    />
                </div>
                <p className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">{ticket.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
       <footer className="text-center mt-8 text-muted-foreground text-sm">
        <p>Scan these QR codes with the Ticket Validator app on the main page.</p>
      </footer>
    </div>
  );
}
