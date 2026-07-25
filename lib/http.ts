import { ExamError } from "./exam.server";

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function apiError(error: unknown) {
  if (error instanceof ExamError) {
    return json(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }
  console.error(error);
  return json(
    { error: "An internal error occurred.", code: "internal_error" },
    { status: 500 },
  );
}

export function badgeJson(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/ld+json; charset=utf-8");
  headers.set("access-control-allow-origin", "*");
  headers.set("x-content-type-options", "nosniff");
  return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}
