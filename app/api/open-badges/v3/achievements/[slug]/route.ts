import { badgeJson } from "@/lib/http";
import { LEVELS, type LevelId } from "@/lib/policy";
import { publicBaseUrl } from "@/lib/runtime";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const entry = Object.entries(LEVELS).find(([, value]) => value.slug === slug);
  if (!entry) return badgeJson({ error: "Not found" }, { status: 404 });
  const [levelKey, level] = entry;
  const base = publicBaseUrl();
  return badgeJson(
    {
      "@context":
        "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
      id: `${base}/api/open-badges/v3/achievements/${level.slug}`,
      type: ["Achievement"],
      achievementType: "Certification",
      name: level.title,
      description: level.description,
      criteria: {
        id: `${base}/criteria/${level.slug}`,
        narrative:
          "Complete the current Voice AI Space assessment under the published conditions and achieve at least 80%.",
      },
      image: {
        id: `${base}/badges/${LEVELS[Number(levelKey) as LevelId].slug}.png`,
        type: "Image",
        caption: `${level.title} badge`,
      },
    },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
