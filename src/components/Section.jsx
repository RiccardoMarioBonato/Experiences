export default function Section({ id, title, isExpanded, onToggle, children }) {
  return (
    <section className="section" id={id}>
      <button className="section-header" onClick={onToggle} type="button">
        <h2 className="section-title">{title}</h2>
        <span className="toggle-icon">{isExpanded ? '-' : '+'}</span>
      </button>
      {isExpanded && <div className="section-content">{children}</div>}
    </section>
  );
}
