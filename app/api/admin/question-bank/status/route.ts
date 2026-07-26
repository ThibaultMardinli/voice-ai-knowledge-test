import { getCandidate } from "@/app/chatgpt-auth";
import { json } from "@/lib/http";
import { questionBankStatus } from "@/lib/question-bank.server";
import { isAdmin } from "@/lib/runtime";

export async function GET() {
  const candidate = await getCandidate();
  if (!candidate || !isAdmin(candidate.email)) {
    return json({ error: "Not found" }, { status: 404 });
  }
  return json(await questionBankStatus());
}
