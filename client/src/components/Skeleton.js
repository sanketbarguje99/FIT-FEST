import React from "react";

function Skeleton({ rows = 3 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-line" key={i} style={{ width: i % 2 ? "70%" : "94%" }} />
      ))}
    </div>
  );
}

export default Skeleton;
