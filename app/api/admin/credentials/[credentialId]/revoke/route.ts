import { getCandidate } from "@/app/chatgpt-auth";
import { candidateId } from "@/lib/crypto.server";
import { revokeCredential } from "@/lib/credentials.server";
import { apiError, json } from "@/lib/http";
import { isAdmin } from "@/lib/runtime";

export async function POST(
  request: Request,
  context: { params: Promise<{ credentialId: string }> },
) {
  try {
    const candidate = await getCandidate();
    if (!candidate || !isAdmin(candidate.email)) {
      return json({ error: "Not found" }, { status: 404 });
    }
    const { credentialId } = await context.params;
    const body = (await request.json()) as { reason?: string };
    const reason = body.reason?.trim() ?? "";
    if (reason.length < 5 || reason.length > 500) {
      return json(
        { error: "A revocation reason between 5 and 500 characters is required." },
        { status: 400 },
      );
    }
    const changed = await revokeCredential(
      credentialId,
      reason,
      candidateId(candidate.email),
    );
    return json({ revoked: changed });
  } catch (error) {
    return apiError(error);
  }
}
