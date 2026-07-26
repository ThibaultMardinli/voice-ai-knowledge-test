import { getCredential } from "@/lib/credentials.server";
import { badgeJson } from "@/lib/http";
import { assertionV2 } from "@/lib/open-badges.server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ credentialId: string }> },
) {
  const { credentialId } = await context.params;
  const credential = await getCredential(credentialId);
  if (!credential) return badgeJson({ error: "Not found" }, { status: 404 });
  if (credential.status === "revoked") {
    return badgeJson(
      {
        id: assertionV2(credential).id,
        type: "Assertion",
        revoked: true,
        revocationReason: credential.revocationReason ?? "Revoked by issuer",
      },
      { status: 410 },
    );
  }
  return badgeJson(assertionV2(credential), {
    headers: { "cache-control": "public, max-age=300" },
  });
}
