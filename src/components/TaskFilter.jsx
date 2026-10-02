export default function TaskFilter({ filters, onChange, searchRef }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  return (
    <div className="row">
      <input ref={searchRef} type="search" aria-label="Recherche" placeholder="Rechercher" value={filters.search} onChange={set("search")} />
      <button type="button" className="ghost" onClick={() => searchRef.current?.focus()}>Focus search</button>
      <select aria-label="Statut" value={filters.status} onChange={set("status")}>
        {["ALL", "TODO", "DONE"].map((v) => <option key={v}>{v}</option>)}
      </select>
      <select aria-label="Filtre priorité" value={filters.priority} onChange={set("priority")}>
        {["ALL", "LOW", "MEDIUM", "HIGH"].map((v) => <option key={v}>{v}</option>)}
      </select>
    </div>
  );
}
