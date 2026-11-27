export function appOrigin(): string {
  const appBaseUrl = Deno.env.get('APP_BASE_URL');
  if (!appBaseUrl) throw new Error('Missing APP_BASE_URL');
  return new URL(appBaseUrl).origin;
}

export function corsHeaders(request: Request): Record<string, string> {
  const origin = appOrigin();
  return {
    'Access-Control-Allow-Origin': request.headers.get('origin') === origin ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

export function rejectUnexpectedOrigin(request: Request): void {
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin && requestOrigin !== appOrigin()) {
    throw new Error('Origin is not allowed');
  }
}

export function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' }
  });
}

export function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function handleOptions(request: Request): Response {
  return new Response('ok', { headers: corsHeaders(request) });
}
