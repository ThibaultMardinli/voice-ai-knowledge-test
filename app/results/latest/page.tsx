import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAssessmentIdentity } from "@/lib/assessment-identity.server";
import { latestCompletedSession } from "@/lib/exam.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Latest assessment result" };

export default async function LatestResultPage() {
  const identity = await requireAssessmentIdentity("/results/latest");
  const session = await latestCompletedSession(identity.identityKeys);
  redirect(session ? `/results/${session.id}` : "/assessment");
}
