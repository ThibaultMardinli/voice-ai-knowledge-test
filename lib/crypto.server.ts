import "server-only";
import { createHmac, createHash, randomBytes, randomUUID } from "node:crypto";
import { importJWK, importPKCS8, jwtVerify, SignJWT } from "jose";
import { keyId, publicBaseUrl, requiredSecret } from "./runtime";

export function newId() {
  return randomUUID();
}

export function newCredentialId(levelSlug: string) {
  const token = randomBytes(16).toString("base64url").toUpperCase();
  return `VAS-2026-${levelSlug.toUpperCase()}-${token}`;
}

export function randomSalt() {
  return randomBytes(16).toString("hex");
}

export function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function candidateId(email: string) {
  return createHmac("sha256", requiredSecret("IDENTITY_HMAC_SECRET"))
    .update(email.trim().toLowerCase(), "utf8")
    .digest("hex");
}

export function openBadgesV2Identity(email: string, salt: string) {
  return `sha256$${sha256(`${email.trim().toLowerCase()}${salt}`)}`;
}

export async function signCredential(
  payload: Record<string, unknown>,
  subject: string,
) {
  const privateKey = await importPKCS8(
    requiredSecret("OB3_PRIVATE_KEY").replace(/\\n/g, "\n"),
    "RS256",
  );

  const token = new SignJWT(payload)
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT",
      kid: `${publicBaseUrl()}/.well-known/jwks.json#${keyId()}`,
    })
    .setIssuer(String(payload.issuer && (payload.issuer as { id: string }).id))
    .setSubject(subject)
    .setJti(String(payload.id));
  const validFrom = typeof payload.validFrom === "string"
    ? Date.parse(payload.validFrom)
    : Number.NaN;
  token.setIssuedAt(
    Number.isFinite(validFrom)
      ? Math.floor(validFrom / 1000)
      : Math.floor(Date.now() / 1000),
  );
  return token.sign(privateKey);
}

export async function verifyCredential(jwt: string) {
  const jwk = JSON.parse(requiredSecret("OB3_PUBLIC_JWK")) as JsonWebKey;
  const publicKey = await importJWK(jwk, "RS256");
  return jwtVerify(jwt, publicKey, { algorithms: ["RS256"] });
}
