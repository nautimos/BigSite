import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function buildCorsHeaders(req: NextRequest) {
    const origin = req.headers.get('origin') ?? '*';
    const allowed = process.env.ALLOWED_ORIGIN || '*';
    const allowOrigin = allowed === '*' ? '*' : origin;
    return {
          'Access-Control-Allow-Origin': allowOrigin,
          'Vary': 'Origin',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
    };
}

export async function OPTIONS(req: NextRequest) {
    return new Response(null, { status: 204, headers: buildCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
    try {
          const data = await req.json();
          const required = ['token', 'hostname', 'url', 'version', 'ts'];
          for (const k of required) {
                  if (!(k in data)) {
                            return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400, headers: buildCorsHeaders(req) });
                  }
          }

      console.log('[checkin]', {
              hostname: data.hostname,
              url: data.url,
              version: data.version,
              ts: data.ts,
      });

      return NextResponse.json({ ok: true }, { status: 200, headers: buildCorsHeaders(req) });
    } catch (err) {
          return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: buildCorsHeaders(req) });
    }
}
