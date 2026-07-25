import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  chatGPTSignInPath,
  getCandidate,
  type CandidateIdentity,
} from "@/app/chatgpt-auth";
import { newId } from "./crypto.server";
import { practiceMode } from "./runtime";

const PRACTICE_COOKIE = "vas_practice_identity";
const PRACTICE_COOKIE_SECONDS = 60 * 60 * 24 * 30;

export type AssessmentIdentity = {
  identityKey: string;
  candidate: CandidateIdentity | null;
  credentialEmail: string | null;
};

export async function getAssessmentIdentity(): Promise<AssessmentIdentity | null> {
  const candidate = await getCandidate();
  if (candidate) {
    return {
      identityKey: `email:${candidate.email.trim().toLowerCase()}`,
      candidate,
      credentialEmail: candidate.email,
    };
  }
  if (!practiceMode()) return null;

  const token = (await cookies()).get(PRACTICE_COOKIE)?.value;
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  return {
    identityKey: `practice:${token}`,
    candidate: null,
    credentialEmail: null,
  };
}

export async function requireAssessmentIdentity(returnTo: string) {
  const identity = await getAssessmentIdentity();
  if (identity) return identity;
  if (practiceMode()) redirect("/assessment");
  redirect(chatGPTSignInPath(returnTo));
}

export function createPracticeIdentity(): AssessmentIdentity & {
  cookieHeader: string;
} {
  const token = newId();
  return {
    identityKey: `practice:${token}`,
    candidate: null,
    credentialEmail: null,
    cookieHeader: [
      `${PRACTICE_COOKIE}=${encodeURIComponent(token)}`,
      "Path=/",
      `Max-Age=${PRACTICE_COOKIE_SECONDS}`,
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
    ].join("; "),
  };
}
