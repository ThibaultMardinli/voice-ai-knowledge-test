import "server-only";
import { env } from "cloudflare:workers";

type RuntimeValues = {
  PUBLIC_BASE_URL?: string;
  IDENTITY_HMAC_SECRET?: string;
  OB3_PRIVATE_KEY?: string;
  OB3_PUBLIC_JWK?: string;
  OB3_KEY_ID?: string;
  ISSUANCE_ENABLED?: string;
  ASSESSMENT_ENABLED?: string;
  PRACTICE_MODE?: string;
  DEPLOYMENT_STAGE?: string;
  ADMIN_EMAILS?: string;
  QUESTION_BANK_IMPORT_SECRET?: string;
};

function values() {
  return env as unknown as RuntimeValues;
}

export function publicBaseUrl() {
  return (values().PUBLIC_BASE_URL ?? "https://credentials.voiceaispace.com").replace(
    /\/+$/,
    "",
  );
}

export function requiredSecret(name: keyof RuntimeValues) {
  const value = values()[name];
  if (!value) throw new Error(`Missing required runtime value: ${name}`);
  return value;
}

export function optionalRuntimeValue(name: keyof RuntimeValues) {
  return values()[name] ?? null;
}

export function issuanceEnabled() {
  return values().ISSUANCE_ENABLED === "true";
}

export function assessmentEnabled() {
  return values().ASSESSMENT_ENABLED === "true" || issuanceEnabled();
}

export function practiceMode() {
  return values().PRACTICE_MODE === "true";
}

export function deploymentStage() {
  return values().DEPLOYMENT_STAGE ?? "production";
}

export function keyId() {
  return values().OB3_KEY_ID ?? "vas-ob3-2026-01";
}

export function isAdmin(email: string) {
  const admins = (values().ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}
