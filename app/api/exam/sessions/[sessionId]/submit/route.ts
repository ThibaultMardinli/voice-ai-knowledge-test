import { getAssessmentIdentity } from "@/lib/assessment-identity.server";
import { submitExam } from "@/lib/exam.server";
import { apiError, json } from "@/lib/http";

export async function POST(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const identity = await getAssessmentIdentity();
    if (!identity) {
      return json(
        { error: "Sign in is required.", code: "authentication_required" },
        { status: 401 },
      );
    }
    const { sessionId } = await context.params;
    return json(
      await submitExam(
        sessionId,
        identity.identityKey,
        identity.credentialEmail,
      ),
    );
  } catch (error) {
    return apiError(error);
  }
}
