import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Handle preflight requests
  if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
                status: 200,
                headers: {
                          'Access-Control-Allow-Origin': '*',
                          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                          'Access-Control-Max-Age': '86400',
                },
        });
  }

  // Rewrite legacy /v1/* paths to /api/v1/* to support installed scripts
  const url = new URL(request.url);
    if (url.pathname.startsWith('/v1/')) {
          url.pathname = '/api' + url.pathname;
          return NextResponse.rewrite(url);
    }

  // Handle actual requests and set CORS
  const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

// Apply middleware to API routes and legacy v1 paths
export const config = {
    matcher: ['/api/:path*', '/v1/:path*'],
};
