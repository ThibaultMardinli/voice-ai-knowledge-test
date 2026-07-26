import { getCandidate } from "@/app/chatgpt-auth";
import { candidateId } from "@/lib/crypto.server";
import { apiError, json } from "@/lib/http";
import {
  importQuestionBank,
  type QuestionImport,
} from "@/lib/question-bank.server";
import {
  isAdmin,
  optionalRuntimeValue,
} from "@/lib/runtime";

export async function POST(request: Request) {
  try {
    const candidate = await getCandidate();
    const authorization = request.headers.get("authorization");
    const importSecret = optionalRuntimeValue("QUESTION_BANK_IMPORT_SECRET");
    const secretAuthorized =
      Boolean(importSecret) &&
      authorization?.startsWith("Bearer ") &&
      authorization.slice("Bearer ".length) === importSecret;
    const adminAuthorized = candidate ? isAdmin(candidate.email) : false;
    if (!secretAuthorized && !adminAuthorized) {
      return json({ error: "Not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      version?: string;
      questions?: QuestionImport[];
    };
    return json(
      await importQuestionBank({
        version: body.version ?? "",
        questions: body.questions ?? [],
        actorId: candidate
          ? candidateId(candidate.email)
          : "one-time-secure-import",
      }),
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
