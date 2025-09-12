import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the QR code token from QR code data
 * @param qrData The raw data from the QR code
 * @returns The QR code token if found, null otherwise
 */
export function extractQrCodeToken(qrData: string): string | null {
  try {
    console.log('Extracting token from:', qrData);
    
    // Handle JSON format like "qrCodeToken":"fa3354d36a159b946bb2f0540c8dc34b"
    const jsonPattern = /"qrCodeToken"\s*:\s*"([^"]+)"/i;
    const jsonMatch = qrData.match(jsonPattern);
    console.log('JSON match:', jsonMatch);
    
    if (jsonMatch && jsonMatch[1]) {
      console.log('Found JSON token:', jsonMatch[1]);
      return jsonMatch[1];
    }
    
    // Handle URLs like "https://tixbook.com/booking/686b52a51f85f2ba7bf56f36" (legacy support)
    const urlPattern = /https?:\/\/tixbook\.com\/booking\/([a-f0-9]+)/i;
    const urlMatch = qrData.match(urlPattern);
    console.log('URL match:', urlMatch);
    
    if (urlMatch && urlMatch[1]) {
      console.log('Found URL token:', urlMatch[1]);
      return urlMatch[1];
    }
    
    // If it's just the token/ID directly (without JSON or URL)
    const tokenPattern = /^[a-f0-9]{24,32}$/i;
    const tokenMatch = tokenPattern.test(qrData);
    console.log('Direct token match:', tokenMatch);
    
    if (tokenMatch) {
      console.log('Found direct token:', qrData);
      return qrData;
    }
    
    console.log('No token found');
    return null;
  } catch (error) {
    console.error('Error extracting QR code token:', error);
    return null;
  }
}

/**
 * @deprecated Use extractQrCodeToken instead
 * Extracts the booking ID from a QR code URL
 * @param qrData The raw data from the QR code
 * @returns The booking ID if found, null otherwise
 */
export function extractBookingId(qrData: string): string | null {
  return extractQrCodeToken(qrData);
}
