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

async function readBody(req: NextRequest) {
      const ct = req.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
              return await req.json();
      }
      const txt = await req.text();
      try { return JSON.parse(txt); } catch { return {}; }
}

async function persistKV(event: any) {
      const url = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;
      if (!url || !token) return;
      const key = `site_checkins:${event.hostname}:${event.ts}`;
      await fetch(`${url}/set/${encodeURIComponent(key)}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: event })
      }).catch(() => {});
}

export async function OPTIONS(req: NextRequest) {
      return new Response(null, { status: 204, headers: buildCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
      const headers = buildCorsHeaders(req);
      try {
              const data = await readBody(req);
              const required = ['token', 'hostname', 'url', 'version', 'ts'];
              for (const k of required) {
                        if (!(k in data)) {
                                    return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400, headers });
                        }
              }

        const expected = process.env.BIGSITE_TOKEN;
              if (expected && data.token !== expected) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
              }

        console.log('[checkin]', {
