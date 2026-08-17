import type { Metadata } from "next";
import Link from "next/link";
import { getCandidate } from "./chatgpt-auth";
import { deploymentStage, isAdmin, publicBaseUrl } from "@/lib/runtime";
import "./globals.css";

export function generateMetadata(): Metadata {
  const isProduction = deploymentStage() === "production";

  return {
    metadataBase: new URL(publicBaseUrl()),
    title: {
      default: "Voice AI Space Certification",
      template: "%s · Voice AI Space Certification",
    },
    description:
      "Independent, verifiable Voice AI knowledge credentials issued by Voice AI Space.",
    applicationName: "Voice AI Space Certification",
    icons: {
      icon: [
        { url: "/favicon.png", type: "image/png", sizes: "48x48" },
        { url: "/favicon.webp", type: "image/webp", sizes: "48x48" },
      ],
      shortcut: "/favicon.png",
    },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: "Voice AI Space Certification",
      description:
        "Prove your Voice AI knowledge with a server-scored, publicly verifiable credential.",
      siteName: "Voice AI Space",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Voice AI Space Certification — Prove what you know.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Voice AI Space Certification",
      description:
        "Independent, verifiable Voice AI knowledge credentials.",
      images: ["/og.png"],
    },
    robots: isProduction
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const stage = deploymentStage();
  const candidate = await getCandidate();
  const showAdmin = candidate ? isAdmin(candidate.email) : false;

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          {stage !== "production" ? (
            <div className="dev-banner" role="status">
              {stage === "beta"
                ? "PUBLIC BETA · QUIZ OPEN · CREDENTIALS ENABLED"
                : "DEVELOPMENT PREVIEW · ISSUANCE DISABLED"}
            </div>
          ) : null}
          <header className="site-header">
            <Link className="wordmark" href="/" aria-label="Voice AI Space Certification">
              <span>VOICE AI / <em>SPACE</em></span>
              <strong>CERTIFICATION</strong>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/learn">Glossary</Link>
              <Link href="/#credentials">Credentials</Link>
              {showAdmin ? (
                <Link href="/admin/questions">Question Bank</Link>
              ) : null}
              <Link className="admin-nav-link" href="/assessment">
                Take Quiz
              </Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div>
              <span className="eyebrow">ISSUED BY</span>
              <strong>Voice AI Space</strong>
            </div>
            <div className="footer-links">
              <a href="https://www.voiceaispace.com/" target="_blank" rel="noreferrer">
                voiceaispace.com
              </a>
              <a
                href="https://www.linkedin.com/company/voice-ai-space"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a href="mailto:tbot@voiceaispace.com">Contact</a>
              <Link href="/methodology">Methodology</Link>
              <Link href="/verify">Verify</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
