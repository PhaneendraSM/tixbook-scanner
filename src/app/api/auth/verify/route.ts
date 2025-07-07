import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Here you would typically verify the token with your backend
    // For now, we'll just check if it exists
    return NextResponse.json(
      { success: true, message: 'Token is valid' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Token verification failed' },
      { status: 500 }
    );
  }
} 