import React from "react";
import "../../styles/components.css";

export const Table = ({
  columns = [],
  data = [],
  onRowClick,
  className,
  striped = true,
  hover = true,
}) => {
  return (
    <div className={`table-wrapper ${className || ""}`}>
      <table
        className={`table ${striped ? "table-striped" : ""} ${hover ? "table-hover" : ""}`}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
