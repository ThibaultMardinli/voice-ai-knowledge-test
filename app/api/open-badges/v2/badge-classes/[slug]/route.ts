import { badgeJson } from "@/lib/http";
import { badgeClassV2 } from "@/lib/open-badges.server";
import { LEVELS, type LevelId } from "@/lib/policy";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const entry = Object.entries(LEVELS).find(([, value]) => value.slug === slug);
  if (!entry) return badgeJson({ error: "Not found" }, { status: 404 });
  return badgeJson(badgeClassV2(Number(entry[0]) as LevelId), {
    headers: { "cache-control": "public, max-age=3600" },
  });
}
