/**
 * Deno Deploy API Forward Proxy
 *
 * URL format: https://YOUR-DOMAIN/{target_host}/{path}
 * Example:   https://api-forward.deno.dev/api.openai.com/v1/chat/completions
 *            -> https://api.openai.com/v1/chat/completions
 */

const ALLOWED_DOMAINS_ENV = Deno.env.get("ALLOWED_DOMAINS") ?? "";
const ALLOWED_DOMAINS = new Set(
  ALLOWED_DOMAINS_ENV.split(",")
    .map((d: string) => d.trim())
    .filter((d: string) => d.length > 0),
);

const HOP_BY_HOP = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
];

function withCors(headers: Headers): Headers {
  headers.set("Access-Control-Allow-Origin", "*");
  return headers;
}

function jsonResponse(data: Record<string, unknown>, status: number): Response {
  const headers = withCors(new Headers({ "Content-Type": "application/json" }));
  return new Response(JSON.stringify(data), { status, headers });
}

function homepage(): Response {
  const domains =
    ALLOWED_DOMAINS.size > 0
      ? ALLOWED_DOMAINS_ENV.split(",")
          .map((d: string) => d.trim())
          .join("\n  ")
      : "(all domains allowed)";
  const body = `Deno API Forward Proxy

URL format:
  https://YOUR-DOMAIN/{target_host}/{path}

Example:
  curl https://api-forward.deno.dev/api.openai.com/v1/models \\
    -H "Authorization: Bearer $OPENAI_API_KEY"

Allowed domains:
  ${domains}
`;
  const headers = withCors(
    new Headers({ "Content-Type": "text/plain; charset=utf-8" }),
  );
  return new Response(body, { status: 200, headers });
}

function optionsResponse(): Response {
  const headers = withCors(
    new Headers({
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    }),
  );
  return new Response(null, { status: 200, headers });
}

async function proxyRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Root path -> homepage
  if (url.pathname === "/") {
    return homepage();
  }

  // OPTIONS preflight
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  // If ALLOWED_DOMAINS is empty, allow all domains
  const allowAll = ALLOWED_DOMAINS.size === 0;

  // Parse target: /{host}/{path...}
  const targetPart = decodeURIComponent(url.pathname.slice(1)); // remove leading /
  const slashIndex = targetPart.indexOf("/");
  const targetHost =
    slashIndex === -1 ? targetPart : targetPart.slice(0, slashIndex);
  const targetPath = slashIndex === -1 ? "/" : targetPart.slice(slashIndex);

  if (!allowAll && !ALLOWED_DOMAINS.has(targetHost)) {
    return jsonResponse(
      { error: "Domain not allowed", domain: targetHost },
      403,
    );
  }

  const targetUrl = `https://${targetHost}${targetPath}${url.search}`;

  // Build forwarded headers
  const headers = new Headers(req.headers);
  HOP_BY_HOP.forEach((h) => headers.delete(h));
  headers.delete("accept-encoding");

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    fetchOptions.body = req.body;
    // @ts-ignore duplex needed for streaming request body in Deno
    fetchOptions.duplex = "half";
  }

  try {
    const res = await fetch(targetUrl, fetchOptions);
    const resHeaders = new Headers(res.headers);
    resHeaders.delete("content-encoding");
    resHeaders.delete("content-length");
    withCors(resHeaders);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: "Proxy error", message }, 500);
  }
}

Deno.serve(proxyRequest);

// Export handler for testing
export { proxyRequest };
