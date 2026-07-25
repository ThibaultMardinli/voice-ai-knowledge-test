declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    PUBLIC_BASE_URL?: string;
    IDENTITY_HMAC_SECRET?: string;
    OB3_PRIVATE_KEY?: string;
    OB3_PUBLIC_JWK?: string;
    OB3_KEY_ID?: string;
    ISSUANCE_ENABLED?: string;
    DEPLOYMENT_STAGE?: string;
    ADMIN_EMAILS?: string;
    QUESTION_BANK_IMPORT_SECRET?: string;
  }
}
