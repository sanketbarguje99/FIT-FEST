import React from "react";

function EmptyState({ glyph = "—", lead, hint }) {
  return (
    <div className="empty-state">
      <span className="glyph">{glyph}</span>
      <div className="lead">{lead}</div>
      {hint && <div>{hint}</div>}
    </div>
  );
}

export default EmptyState;
