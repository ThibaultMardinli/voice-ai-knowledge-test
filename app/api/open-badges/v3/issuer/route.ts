import { badgeJson } from "@/lib/http";
import { issuerProfileV3 } from "@/lib/open-badges.server";

export async function GET() {
  return badgeJson(issuerProfileV3(), {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
