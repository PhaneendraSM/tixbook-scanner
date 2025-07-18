import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the booking ID from a QR code URL
 * @param qrData The raw data from the QR code
 * @returns The booking ID if found, null otherwise
 */
export function extractBookingId(qrData: string): string | null {
  try {
    // Handle URLs like "https://tixbook.com/booking/686b52a51f85f2ba7bf56f36"
    const urlPattern = /https?:\/\/tixbook\.com\/booking\/([a-f0-9]+)/i;
    const match = qrData.match(urlPattern);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // If it's just the booking ID directly (without URL)
    const bookingIdPattern = /^[a-f0-9]{24}$/i;
    if (bookingIdPattern.test(qrData)) {
      return qrData;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting booking ID:', error);
    return null;
  }
}
