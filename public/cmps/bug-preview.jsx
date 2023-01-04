

export function BugPreview({ bug }) {
    const dynmClass = (bug.severity > 7) ? 'high-priority' : ''

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span className={dynmClass}>{bug.severity}</span></p>
        <p>{bug.description}</p>
    </article>
}