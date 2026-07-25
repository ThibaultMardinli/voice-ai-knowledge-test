import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://credentials.voiceaispace.com"),
  title: {
    default: "Voice AI Space Certification",
    template: "%s · Voice AI Space Certification",
  },
  description:
    "Independent, verifiable Voice AI knowledge credentials issued by Voice AI Space.",
  applicationName: "Voice AI Space Certification",
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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="wordmark" href="/" aria-label="Voice AI Space Certification">
              <span>VOICE AI / <em>SPACE</em></span>
              <strong>CERTIFICATION</strong>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/#credentials">Credentials</Link>
              <Link href="/#standard">Standard</Link>
              <Link href="/methodology">Methodology</Link>
              <Link href="/verify">Verify</Link>
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
              <Link href="/privacy">Privacy</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
