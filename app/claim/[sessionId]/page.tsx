import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireCandidate } from "@/app/chatgpt-auth";
import { getAssessmentIdentity } from "@/lib/assessment-identity.server";
import { claimCredential } from "@/lib/exam.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Claim credential" };

export default async function ClaimCredentialPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const candidate = await requireCandidate(`/claim/${sessionId}`);
  const identity = await getAssessmentIdentity();
  if (!identity) redirect(`/results/${sessionId}`);

  const result = await claimCredential(
    sessionId,
    identity.identityKeys,
    candidate.email,
  );
  redirect(`/credentials/${result.credentialId}`);
}
