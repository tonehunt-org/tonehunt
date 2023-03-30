import type { ReactNode } from "react";

export type Column<T> = {
  title: string;
  className?: string;
  renderCell: (item: T) => ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full text-left text-sm font-light border-spacing-y-2 border-separate">
      <thead className="border-b font-medium border-neutral-500">
        <tr>
          {columns.map((column) => {
            return (
              <th key={column.title} scope="col" className={`px-6 py-4 ${column.className}`}>
                {column.title}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {data.map((data) => {
          return (
            <tr key={data.id} className="bg-black/10 align-top">
              {columns.map((column) => {
                return (
                  <td key={`${column.title}${data.id}`} className="whitespace-nowrap px-6 py-4">
                    {column.renderCell(data)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
