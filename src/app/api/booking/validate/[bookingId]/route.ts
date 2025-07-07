import { NextRequest, NextResponse } from 'next/server';

// Helper function to get auth token from request
const getAuthTokenFromRequest = (request: NextRequest): string | null => {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies as fallback
  const token = request.cookies.get('authToken')?.value;
  return token || null;
};

// Mock database of bookings - in a real app, this would be a database query
const bookings = new Map([
  ['686b52a51f85f2ba7bf56f36', {
    id: '686b52a51f85f2ba7bf56f36',
    eventName: 'Starlight Music Festival',
    ticketType: 'VIP Access',
    ownerName: 'Jane Doe',
    status: 'valid', // 'valid', 'invalid', 'already_scanned'
    scannedAt: null,
  }],
  ['1234567890abcdef12345678', {
    id: '1234567890abcdef12345678',
    eventName: 'Tech Conference 2024',
    ticketType: 'Full Pass',
    ownerName: 'Alice Johnson',
    status: 'already_scanned',
    scannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Scanned 2 hours ago
  }],
  ['abcdef1234567890abcdef12', {
    id: 'abcdef1234567890abcdef12',
    eventName: 'Sports Championship',
    ticketType: 'General Admission',
    ownerName: 'John Smith',
    status: 'valid',
    scannedAt: null,
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    // Check authentication
    const authToken = getAuthTokenFromRequest(request);
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Access Denied' },
        { status: 401 }
      );
    }
    
    // Here you would typically verify the token with your backend
    // For now, we'll just check if it exists and has a reasonable length
    if (authToken.length < 10) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { bookingId } = params;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const booking = bookings.get(bookingId);

    if (!booking) {
      return NextResponse.json(
        { 
          status: 'invalid',
          message: 'This booking does not exist.',
        },
        { status: 200 }
      );
    }

    // If the booking is valid and hasn't been scanned, mark it as scanned
    if (booking.status === 'valid') {
      booking.status = 'already_scanned';
      booking.scannedAt = new Date();
    }

    const response = {
      status: booking.status,
      message: booking.status === 'valid' 
        ? 'Entry Allowed' 
        : booking.status === 'already_scanned' 
        ? 'This ticket has already been used.'
        : 'This ticket is invalid.',
      ticket: {
        id: booking.id,
        eventName: booking.eventName,
        ticketType: booking.ticketType,
        ownerName: booking.ownerName,
        scannedAt: booking.scannedAt,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error validating booking:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'An unexpected error occurred during verification.'
      },
      { status: 500 }
    );
  }
} 