import "./tcg-badge.css"

/**
 * ITC Cheltenham Bold Condensed caps, filled with the brand colour of the
 * surrounding context (`color` on any ancestor, or --tcg-brand).
 * Static by request: the hover sequence (hairline frame, corner dots,
 * MetallicPaint steel plaque) was removed, which also drops a WebGL context
 * from every page's footer.
 */
const HREF = "https://talkerstein.ca"

export function TcgBadge() {
  return (
    <footer className="tcg-footer">
      <a className="tcg-plaque" href={HREF} aria-label="Handcrafted by Talkerstein Consulting Group">
        <span className="tcg-text" aria-hidden="true" />
      </a>
    </footer>
  )
}
