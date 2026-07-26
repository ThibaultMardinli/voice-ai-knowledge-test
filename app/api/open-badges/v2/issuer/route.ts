import { badgeJson } from "@/lib/http";
import { issuerProfileV2 } from "@/lib/open-badges.server";

export async function GET() {
  return badgeJson(issuerProfileV2(), {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
