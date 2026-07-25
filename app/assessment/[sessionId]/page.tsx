import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireCandidate } from "@/app/chatgpt-auth";
import { ExamRunner } from "@/components/ExamRunner";
import { ExamError, loadSession } from "@/lib/exam.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Assessment in progress" };

export default async function ActiveAssessmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const candidate = await requireCandidate(`/assessment/${sessionId}`);
  try {
    const session = await loadSession(sessionId, candidate.email);
    if (session.status === "completed") redirect(`/results/${sessionId}`);
    return <ExamRunner session={session} />;
  } catch (error) {
    if (error instanceof ExamError && error.status === 404) notFound();
    throw error;
  }
}
