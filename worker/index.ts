import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (
      url.hostname === "voice-ai-certification.t-bot85.chatgpt.site" &&
      isPublicCredentialPath(url.pathname)
    ) {
      url.hostname = "credentials.voiceaispace.com";
      return withSecurityHeaders(Response.redirect(url, 308));
    }
    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(
        request,
        {
          fetchAsset: (path) =>
            env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
      return withSecurityHeaders(response);
    }
    return withSecurityHeaders(await handler.fetch(request, env, ctx));
  },
};

function isPublicCredentialPath(pathname: string) {
  return [
    "/credentials/",
    "/criteria/",
    "/api/open-badges/",
    "/badges/",
  ].some((prefix) => pathname.startsWith(prefix));
}

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  headers.set(
    "content-security-policy",
    "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests",
  );
  headers.set("cross-origin-opener-policy", "same-origin-allow-popups");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set(
    "strict-transport-security",
    "max-age=31536000; includeSubDomains",
  );
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default worker;
