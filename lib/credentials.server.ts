import "server-only";
import { getRawDb } from "@/db";
import { newId } from "./crypto.server";
import { type CredentialRecord } from "./open-badges.server";

export async function getCredential(id: string) {
  const row = await getRawDb()
    .prepare(
      `SELECT id, recipient_name, recipient_id, recipient_ob2_identity,
              recipient_ob2_salt, level, title, exam_version, score, percentage,
              issued_at, expires_at, status, revoked_at, revocation_reason,
              ob3_jwt
       FROM credentials WHERE id = ?`,
    )
    .bind(id)
    .first<{
      id: string;
      recipient_name: string;
      recipient_id: string;
      recipient_ob2_identity: string;
      recipient_ob2_salt: string;
      level: number;
      title: string;
      exam_version: string;
      score: number;
      percentage: number;
      issued_at: string;
      expires_at: string;
      status: string;
      revoked_at: string | null;
      revocation_reason: string | null;
      ob3_jwt: string | null;
    }>();
  if (!row) return null;

  return {
    id: row.id,
    recipientName: row.recipient_name,
    recipientId: row.recipient_id,
    recipientOb2Identity: row.recipient_ob2_identity,
    recipientOb2Salt: row.recipient_ob2_salt,
    level: row.level,
    title: row.title,
    examVersion: row.exam_version,
    score: row.score,
    percentage: row.percentage,
    issuedAt: row.issued_at,
    expiresAt: row.expires_at,
    status: row.status,
    revokedAt: row.revoked_at,
    revocationReason: row.revocation_reason,
    ob3Jwt: row.ob3_jwt,
  } satisfies CredentialRecord;
}

export async function revokeCredential(
  id: string,
  reason: string,
  actorId: string,
) {
  const now = new Date().toISOString();
  const result = await getRawDb().batch([
    getRawDb()
      .prepare(
        `UPDATE credentials
         SET status = 'revoked', revoked_at = ?, revocation_reason = ?
         WHERE id = ? AND status = 'valid'`,
      )
      .bind(now, reason, id),
    getRawDb()
      .prepare(
        `INSERT INTO audit_events
          (id, event_type, subject_id, actor_id, metadata, created_at)
         VALUES (?, 'credential.revoked', ?, ?, ?, ?)`,
      )
      .bind(newId(), id, actorId, JSON.stringify({ reason }), now),
  ]);
  return result[0].meta.changes > 0;
}

export function credentialState(record: CredentialRecord) {
  if (record.status === "revoked") return "revoked" as const;
  if (Date.parse(record.expiresAt) <= Date.now()) return "expired" as const;
  return "valid" as const;
}
