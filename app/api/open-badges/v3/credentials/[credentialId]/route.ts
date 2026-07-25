import { getCredential } from "@/lib/credentials.server";
import { json } from "@/lib/http";

export async function GET(
  _request: Request,
  context: { params: Promise<{ credentialId: string }> },
) {
  const { credentialId } = await context.params;
  const credential = await getCredential(credentialId);
  if (!credential) return json({ error: "Not found" }, { status: 404 });
  if (credential.status === "revoked") {
    return json(
      {
        error: "Credential revoked",
        reason: credential.revocationReason,
      },
      { status: 410 },
    );
  }
  if (!credential.ob3Jwt) {
    return json({ error: "Credential proof unavailable" }, { status: 503 });
  }
  return new Response(credential.ob3Jwt, {
    headers: {
      "content-type": "application/vc+jwt",
      "content-disposition": `attachment; filename="${credential.id}.jwt"`,
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
    },
  });
}
