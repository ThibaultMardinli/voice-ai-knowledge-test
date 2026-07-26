import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExamRunner } from "@/components/ExamRunner";
import { requireAssessmentIdentity } from "@/lib/assessment-identity.server";
import { ExamError, loadSession } from "@/lib/exam.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Assessment in progress" };

export default async function ActiveAssessmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const identity = await requireAssessmentIdentity(`/assessment/${sessionId}`);
  try {
    const session = await loadSession(sessionId, identity.identityKeys);
    if (session.status === "completed") redirect(`/results/${sessionId}`);
    return <ExamRunner session={session} />;
  } catch (error) {
    if (error instanceof ExamError && error.status === 404) notFound();
    throw error;
  }
}
