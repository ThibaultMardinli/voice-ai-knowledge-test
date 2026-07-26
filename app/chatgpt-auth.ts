import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type CandidateIdentity = {
  displayName: string;
  email: string;
  fullName: string | null;
};

const SIGN_IN_PATH = "/signin-with-chatgpt";
const SIGN_OUT_PATH = "/signout-with-chatgpt";

export async function getCandidate(): Promise<CandidateIdentity | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  if (!email) return null;

  const encodedName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? safeDecode(encodedName)
      : null;

  return { email, fullName, displayName: fullName ?? email };
}

export async function requireCandidate(returnTo: string) {
  const candidate = await getCandidate();
  if (candidate) return candidate;
  redirect(chatGPTSignInPath(returnTo));
}

export function chatGPTSignInPath(returnTo: string) {
  return `${SIGN_IN_PATH}?return_to=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

export function chatGPTSignOutPath(returnTo = "/") {
  return `${SIGN_OUT_PATH}?return_to=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

function safeReturnTo(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://credential.local");
    if (url.origin !== "https://credential.local") return "/";
    if (
      ["/signin-with-chatgpt", "/signout-with-chatgpt", "/callback"].includes(
        url.pathname,
      )
    ) {
      return "/";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
