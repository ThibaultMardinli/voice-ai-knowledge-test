import { getAssessmentIdentity } from "@/lib/assessment-identity.server";
import { recordAnswer } from "@/lib/exam.server";
import { apiError, json } from "@/lib/http";

export async function PUT(
  request: Request,
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
    const body = (await request.json()) as {
      questionId?: number;
      selectedOption?: number;
    };
    return json(
      await recordAnswer({
        sessionId,
        identityKeys: identity.identityKeys,
        questionId: Number(body.questionId),
        selectedOption: Number(body.selectedOption),
      }),
    );
  } catch (error) {
    return apiError(error);
  }
}
