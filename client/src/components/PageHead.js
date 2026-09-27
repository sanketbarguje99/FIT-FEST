import React from "react";

function PageHead({ title, subtitle }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="page-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <div style={{ color: "var(--muted)", fontSize: 13 }}>{subtitle}</div>}
      </div>
      <div className="date mono">{today}</div>
    </div>
  );
}

export default PageHead;
