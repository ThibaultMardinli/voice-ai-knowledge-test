import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <section className="not-found-message" aria-labelledby="not-found-title">
        <span className="eyebrow">NOT FOUND</span>
        <h1 id="not-found-title">No verified record.</h1>
        <p>
          The requested page or credential ID does not exist. Check the
          identifier exactly as issued.
        </p>
        <div className="not-found-actions">
          <Link className="not-found-link not-found-link--primary" href="/verify">
            Verify another credential
          </Link>
          <Link className="not-found-link" href="/">
            Return home
          </Link>
        </div>
      </section>
    </div>
  );
}
