import { notFound } from "next/navigation";
import { requireCandidate } from "@/app/chatgpt-auth";
import { QuestionBankManager } from "@/components/QuestionBankManager";
import { listQuestionBank, questionBankStatus } from "@/lib/question-bank.server";
import { isAdmin } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function QuestionBankPage() {
  const candidate = await requireCandidate("/admin/questions");
  if (!isAdmin(candidate.email)) notFound();

  const [questions, status] = await Promise.all([
    listQuestionBank(),
    questionBankStatus(),
  ]);

  return (
    <section className="admin-page">
      <header className="admin-intro">
        <div>
          <span className="eyebrow">RESTRICTED · ASSESSMENT OPERATIONS</span>
          <h1>Question Bank</h1>
          <p>
            This is the private certification bank. Correct answers and
            rationales are visible only to approved administrators.
          </p>
        </div>
        <div className="admin-version">
          <span>ACTIVE VERSION</span>
          <strong>{status.version}</strong>
          <small>{questions.length} questions loaded</small>
        </div>
      </header>

      <QuestionBankManager
        initialQuestions={questions}
        version={status.version}
      />
    </section>
  );
}
