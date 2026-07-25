export const EXAM_VERSION = "VAS-2026.1";
export const EXAM_DURATION_MINUTES = 35;
export const EXAM_QUESTION_COUNT = 25;
export const PASS_PERCENTAGE = 80;
export const DISTINCTION_PERCENTAGE = 90;
export const CREDENTIAL_VALIDITY_DAYS = 730;
export const ATTEMPT_WINDOW_DAYS = 30;
export const MAX_ATTEMPTS_PER_WINDOW = 2;

export const DOMAINS = [
  {
    id: 1,
    name: "Voice AI Fundamentals",
    short: "Fundamentals",
    questionCount: 5,
  },
  {
    id: 2,
    name: "Real-Time Architecture & Pipelines",
    short: "Architecture",
    questionCount: 6,
  },
  {
    id: 3,
    name: "LLM + Voice Orchestration",
    short: "Orchestration",
    questionCount: 6,
  },
  {
    id: 4,
    name: "Voice UX & Conversation Design",
    short: "UX & Design",
    questionCount: 4,
  },
  {
    id: 5,
    name: "Enterprise, Compliance & Verticals",
    short: "Compliance",
    questionCount: 4,
  },
] as const;

export const LEVELS = {
  0: {
    slug: "fundamentals",
    label: "Beginner",
    title: "Voice AI Fundamentals",
    credentialType: "Knowledge Badge",
    description:
      "Demonstrates command of core Voice AI vocabulary, components, and concepts.",
  },
  1: {
    slug: "foundations",
    label: "Foundations",
    title: "Voice AI Foundations",
    credentialType: "Knowledge Certificate",
    description:
      "Demonstrates applied understanding across the five core domains of Voice AI.",
  },
  2: {
    slug: "practitioner",
    label: "Intermediate",
    title: "Voice AI Practitioner",
    credentialType: "Professional Certification",
    description:
      "Demonstrates the ability to evaluate implementation trade-offs and production scenarios.",
  },
  3: {
    slug: "architect",
    label: "Expert",
    title: "Voice AI Architect",
    credentialType: "Professional Certification",
    description:
      "Demonstrates advanced judgment in designing production-grade, responsible Voice AI systems.",
  },
} as const;

export type LevelId = keyof typeof LEVELS;

export function isLevelId(value: number): value is LevelId {
  return Number.isInteger(value) && value >= 0 && value <= 3;
}

export function scaledScore(percentage: number) {
  return Math.round(100 + percentage * 9);
}

export function hasDistinction(percentage: number) {
  return percentage >= DISTINCTION_PERCENTAGE;
}
