import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  className?: string;
}

export function DataTable<T>({ columns, data, rowKey, className = "" }: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-[#E8E8E9] ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F1F1F1]">
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider whitespace-nowrap border-r border-[#E8E8E9] last:border-r-0 ${col.className || ""} ${index === 0 ? "rounded-tl-lg" : ""} ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowKey(row)} className="border-t border-[#E8E8E9] bg-white">
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 whitespace-nowrap border-r border-[#E8E8E9] last:border-r-0 ${col.className || ""} ${
                    rowIndex === data.length - 1 && colIndex === 0 ? "rounded-bl-lg" : ""
                  } ${rowIndex === data.length - 1 && colIndex === columns.length - 1 ? "rounded-br-lg" : ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}