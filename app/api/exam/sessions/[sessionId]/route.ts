import { getCandidate } from "@/app/chatgpt-auth";
import { loadSession } from "@/lib/exam.server";
import { apiError, json } from "@/lib/http";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    const candidate = await getCandidate();
    if (!candidate) {
      return json(
        { error: "Sign in is required.", code: "authentication_required" },
        { status: 401 },
      );
    }
    const { sessionId } = await context.params;
    return json(await loadSession(sessionId, candidate.email));
  } catch (error) {
    return apiError(error);
  }
}
