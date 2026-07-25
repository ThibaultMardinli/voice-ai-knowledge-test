import "server-only";
import type { LevelId } from "./policy";
import {
  CREDENTIAL_VALIDITY_DAYS,
  DOMAINS,
  EXAM_QUESTION_COUNT,
  LEVELS,
  PASS_PERCENTAGE,
} from "./policy";
import { keyId, publicBaseUrl, requiredSecret } from "./runtime";

export type CredentialRecord = {
  id: string;
  recipientName: string;
  recipientId: string;
  recipientOb2Identity: string;
  recipientOb2Salt: string;
  level: number;
  title: string;
  examVersion: string;
  score: number;
  percentage: number;
  issuedAt: string;
  expiresAt: string;
  status: string;
  revokedAt: string | null;
  revocationReason: string | null;
  ob3Jwt: string | null;
};

export function issuerProfileV2() {
  const base = publicBaseUrl();
  return {
    "@context": "https://w3id.org/openbadges/v2",
    id: `${base}/api/open-badges/v2/issuer`,
    type: "Profile",
    name: "Voice AI Space",
    url: "https://www.voiceaispace.com/",
    email: "tbot@voiceaispace.com",
    description:
      "Voice AI Space is an independent knowledge platform and community for the Voice AI ecosystem.",
    verification: {
      type: "VerificationObject",
      verificationProperty: "id",
      startsWith: `${base}/api/open-badges/v2/assertions/`,
    },
  };
}

export function badgeClassV2(level: LevelId) {
  const base = publicBaseUrl();
  const definition = LEVELS[level];
  return {
    "@context": "https://w3id.org/openbadges/v2",
    id: `${base}/api/open-badges/v2/badge-classes/${definition.slug}`,
    type: "BadgeClass",
    name: definition.title,
    description: definition.description,
    image: `${base}/badges/${definition.slug}.png`,
    criteria: `${base}/criteria/${definition.slug}`,
    issuer: `${base}/api/open-badges/v2/issuer`,
    tags: [
      "Voice AI",
      "Speech AI",
      "Conversational AI",
      definition.label,
    ],
  };
}

export function assertionV2(record: CredentialRecord) {
  const base = publicBaseUrl();
  const level = record.level as LevelId;
  return {
    "@context": "https://w3id.org/openbadges/v2",
    id: `${base}/api/open-badges/v2/assertions/${record.id}`,
    type: "Assertion",
    recipient: {
      type: "email",
      hashed: true,
      salt: record.recipientOb2Salt,
      identity: record.recipientOb2Identity,
    },
    badge: `${base}/api/open-badges/v2/badge-classes/${LEVELS[level].slug}`,
    verification: { type: "HostedBadge" },
    issuedOn: record.issuedAt,
    expires: record.expiresAt,
    evidence: [
      {
        id: `${base}/credentials/${record.id}`,
        type: "Evidence",
        name: "Proctored knowledge assessment result",
        description: `${record.percentage}% (${record.score}/1000) on ${record.examVersion}`,
        narrative:
          "The recipient completed a server-scored, time-limited assessment across the five core Voice AI domains.",
      },
    ],
  };
}

export function credentialV3(record: CredentialRecord) {
  const base = publicBaseUrl();
  const level = record.level as LevelId;
  const definition = LEVELS[level];
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    ],
    id: `${base}/credentials/${record.id}`,
    type: ["VerifiableCredential", "OpenBadgeCredential"],
    name: definition.title,
    issuer: {
      id: `${base}/api/open-badges/v3/issuer`,
      type: ["Profile"],
      name: "Voice AI Space",
      url: "https://www.voiceaispace.com/",
      email: "tbot@voiceaispace.com",
    },
    validFrom: record.issuedAt,
    validUntil: record.expiresAt,
    credentialSubject: {
      id: record.recipientId,
      type: ["AchievementSubject"],
      achievement: {
        id: `${base}/api/open-badges/v3/achievements/${definition.slug}`,
        type: ["Achievement"],
        achievementType: "Certification",
        name: definition.title,
        description: definition.description,
        criteria: {
          id: `${base}/criteria/${definition.slug}`,
          narrative: `${EXAM_QUESTION_COUNT} questions across five domains; ${PASS_PERCENTAGE}% required to pass; valid for ${CREDENTIAL_VALIDITY_DAYS} days.`,
        },
        image: {
          id: `${base}/badges/${definition.slug}.png`,
          type: "Image",
          caption: `${definition.title} badge`,
        },
        tag: ["Voice AI", "Speech AI", "Conversational AI"],
      },
    },
    evidence: [
      {
        id: `${base}/credentials/${record.id}`,
        type: ["Evidence"],
        name: "Voice AI Space assessment result",
        description: `${record.percentage}% (${record.score}/1000) on ${record.examVersion}`,
        narrative: `Assessment coverage: ${DOMAINS.map((domain) => domain.name).join(", ")}.`,
      },
    ],
    credentialSchema: [
      {
        id: "https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json",
        type: "1EdTechJsonSchemaValidator2019",
      },
    ],
  };
}

export function issuerProfileV3() {
  const base = publicBaseUrl();
  return {
    id: `${base}/api/open-badges/v3/issuer`,
    type: "Profile",
    name: "Voice AI Space",
    url: "https://www.voiceaispace.com/",
    email: "tbot@voiceaispace.com",
    description:
      "Independent Voice AI knowledge platform, professional community, and credential issuer.",
    publicKey: `${base}/api/open-badges/v3/jwks#${keyId()}`,
  };
}

export function publicJwks() {
  const jwk = JSON.parse(requiredSecret("OB3_PUBLIC_JWK")) as Record<
    string,
    unknown
  >;
  return {
    keys: [
      {
        ...jwk,
        kid: `${publicBaseUrl()}/api/open-badges/v3/jwks#${keyId()}`,
        use: "sig",
        alg: "RS256",
      },
    ],
  };
}
