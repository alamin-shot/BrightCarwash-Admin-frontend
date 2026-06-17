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
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F8FAFB] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20V20H4V4Z" stroke="#777980" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="#777980" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 8V16" stroke="#777980" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-[#777980] font-inter text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-[#E8E8E9] ${className}`}>
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#F1F1F1]">
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-left text-[#777980] font-inter text-[10px] sm:text-xs font-medium uppercase tracking-wider whitespace-nowrap border-r border-[#E8E8E9] last:border-r-0 ${col.className || ""} ${index === 0 ? "rounded-tl-lg" : ""} ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
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
                  className={`py-2.5 sm:py-3 px-3 sm:px-4 whitespace-nowrap border-r border-[#E8E8E9] last:border-r-0 ${col.className || ""} ${
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