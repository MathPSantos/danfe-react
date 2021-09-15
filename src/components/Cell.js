export function Cell({ label, value }) {
  return (
    <div className="cell">
      <div className="cell-label mini">{label}</div>
      <div className="cell-value medium">
        <b>{value}</b>
      </div>
    </div>
  );
}
