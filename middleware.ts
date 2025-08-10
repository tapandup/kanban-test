import { NextResponse } from 'next/server';

export function middleware(request) {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');

  if (!email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/project/:path*'],
};
