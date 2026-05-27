import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableColumn } from '../../types';

interface DataTableProps<T extends { id: string; hasAlert?: boolean }> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectedId?: string;
  pageSize?: number;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends { id: string; hasAlert?: boolean }>({
  columns, data, onRowClick, selectedId, pageSize = 25,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc');
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-blue-500" />
      : <ChevronDown size={12} className="text-blue-500" />;
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm font-medium">No records found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse min-w-max">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="table-header w-6 text-center">#</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`table-header ${col.width || ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && <SortIcon colKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-100 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-blue-50/50' : ''
                } ${selectedId === row.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
              >
                <td className="table-cell w-6 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {row.hasAlert && <span className="alert-dot" title="Needs attention" />}
                    {!row.hasAlert && <span className="text-xs text-slate-300">{(page - 1) * pageSize + idx + 1}</span>}
                  </div>
                </td>
                {columns.map(col => {
                  const rawVal = (row as Record<string, unknown>)[col.key];
                  const content = col.render
                    ? col.render(rawVal, row)
                    : (
                      <span
                        className="block max-w-[200px] truncate"
                        title={typeof rawVal === 'string' ? rawVal : undefined}
                      >
                        {rawVal as React.ReactNode}
                      </span>
                    );
                  return (
                    <td key={col.key} className={`table-cell ${col.width || ''}`}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-white flex-shrink-0">
        <span className="text-xs text-slate-500">
          {data.length === 0 ? '0 records' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, data.length)} of ${data.length} records`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-6 h-6 text-xs rounded transition-colors ${
                  page === pageNum
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
