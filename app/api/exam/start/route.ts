import {
  createPracticeIdentity,
  getAssessmentIdentity,
} from "@/lib/assessment-identity.server";
import { startExam } from "@/lib/exam.server";
import { apiError, json } from "@/lib/http";
import { practiceMode } from "@/lib/runtime";

export async function POST(request: Request) {
  try {
    let identity = await getAssessmentIdentity();
    let cookieHeader: string | null = null;
    if (!identity && practiceMode()) {
      const created = createPracticeIdentity();
      identity = created;
      cookieHeader = created.cookieHeader;
    }
    if (!identity) {
      return json(
        { error: "Sign in is required.", code: "authentication_required" },
        { status: 401 },
      );
    }
    const body = (await request.json()) as {
      candidateName?: string;
      level?: number;
      consent?: boolean;
    };
    const session = await startExam({
      identityKey: identity.identityKey,
      candidateName: body.candidateName ?? "",
      level: Number(body.level),
      consent: body.consent === true,
    });
    const response = json(session, { status: 201 });
    if (cookieHeader) response.headers.append("set-cookie", cookieHeader);
    return response;
  } catch (error) {
    return apiError(error);
  }
}
