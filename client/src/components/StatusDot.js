import React from "react";

function StatusDot({ status }) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`status ${key}`}>
      <span className="dot" />
      {status}
    </span>
  );
}

export default StatusDot;
