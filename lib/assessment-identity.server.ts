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
  identityKeys: string[];
  candidate: CandidateIdentity | null;
  credentialEmail: string | null;
};

export async function getAssessmentIdentity(): Promise<AssessmentIdentity | null> {
  const candidate = await getCandidate();
  const token = practiceMode()
    ? (await cookies()).get(PRACTICE_COOKIE)?.value
    : null;
  const practiceIdentity =
    token && /^[0-9a-f-]{36}$/i.test(token) ? `practice:${token}` : null;

  if (candidate) {
    const emailIdentity = `email:${candidate.email.trim().toLowerCase()}`;
    return {
      identityKey: emailIdentity,
      identityKeys: [
        emailIdentity,
        ...(practiceIdentity ? [practiceIdentity] : []),
      ],
      candidate,
      credentialEmail: candidate.email,
    };
  }
  if (!practiceMode()) return null;

  if (!practiceIdentity) return null;
  return {
    identityKey: practiceIdentity,
    identityKeys: [practiceIdentity],
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
    identityKeys: [`practice:${token}`],
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
