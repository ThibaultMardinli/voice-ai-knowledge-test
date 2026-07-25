export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS question_bank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_key TEXT NOT NULL UNIQUE,
    exam_version TEXT NOT NULL,
    level INTEGER NOT NULL,
    domain INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_option INTEGER NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    authored_by TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    source_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS question_bank_blueprint_idx
    ON question_bank(exam_version, level, domain, status)`,
  `CREATE TABLE IF NOT EXISTS exam_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    candidate_id TEXT NOT NULL,
    candidate_name TEXT NOT NULL,
    level INTEGER NOT NULL,
    exam_version TEXT NOT NULL,
    question_ids TEXT NOT NULL,
    started_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    completed_at TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    score INTEGER,
    percentage INTEGER,
    domain_results TEXT,
    credential_id TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS exam_sessions_candidate_idx
    ON exam_sessions(candidate_id)`,
  `CREATE INDEX IF NOT EXISTS exam_sessions_status_idx
    ON exam_sessions(status)`,
  `CREATE INDEX IF NOT EXISTS exam_sessions_started_idx
    ON exam_sessions(started_at)`,
  `CREATE TABLE IF NOT EXISTS exam_answers (
    session_id TEXT NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    selected_option INTEGER NOT NULL,
    answered_at TEXT NOT NULL,
    PRIMARY KEY (session_id, question_id)
  )`,
  `CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL UNIQUE REFERENCES exam_sessions(id),
    recipient_name TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    recipient_ob2_identity TEXT NOT NULL,
    recipient_ob2_salt TEXT NOT NULL,
    level INTEGER NOT NULL,
    title TEXT NOT NULL,
    exam_version TEXT NOT NULL,
    score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    issued_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    revoked_at TEXT,
    revocation_reason TEXT,
    ob3_jwt TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS credentials_recipient_idx
    ON credentials(recipient_id)`,
  `CREATE INDEX IF NOT EXISTS credentials_status_idx
    ON credentials(status)`,
  `CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY NOT NULL,
    event_type TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    actor_id TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS audit_events_subject_idx
    ON audit_events(subject_id)`,
  `CREATE INDEX IF NOT EXISTS audit_events_created_idx
    ON audit_events(created_at)`,
] as const;
