import { getCandidate } from "@/app/chatgpt-auth";
import { startExam } from "@/lib/exam.server";
import { apiError, json } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const candidate = await getCandidate();
    if (!candidate) {
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
      email: candidate.email,
      candidateName: body.candidateName ?? "",
      level: Number(body.level),
      consent: body.consent === true,
    });
    return json(session, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
