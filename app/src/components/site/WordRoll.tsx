/* Caps text link, no box. Each word sits in a clipped box holding two copies;
   on hover the top copy rolls out and the bottom rolls in, staggered per word. */
type Props = {
  children: string
  href: string
  className?: string
}

export function WordRoll({ children, href, className = "" }: Props) {
  const words = children.trim().split(/\s+/)

  return (
    <a href={href} className={className}>
      {words.map((word, i) => (
        <span className="w" key={i} style={{ ["--d" as string]: `${i * 55}ms` }}>
          <span className="wa">{word}</span>
          <span className="wb" aria-hidden="true">{word}</span>
        </span>
      ))}
    </a>
  )
}
