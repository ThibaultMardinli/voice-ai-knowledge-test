import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap">
      <section className="page-panel page-heading">
        <span className="eyebrow">NOT FOUND</span>
        <h1 className="page-title">No verified record.</h1>
        <p>
          The requested page or credential ID does not exist. Check the
          identifier exactly as issued.
        </p>
        <div className="button-row">
          <Link className="button" href="/verify">
            Verify another credential
          </Link>
          <Link className="button secondary" href="/">
            Return home
          </Link>
        </div>
      </section>
    </div>
  );
}
