import { publicJwks } from "@/lib/open-badges.server";

export async function GET() {
  return new Response(JSON.stringify(publicJwks()), {
    headers: {
      "content-type": "application/jwk-set+json",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
      "x-content-type-options": "nosniff",
    },
  });
}
