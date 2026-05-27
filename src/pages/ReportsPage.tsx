import React, { useState, useMemo } from 'react';
import { reports } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { Report, FilterOption, ActiveFilters, TableColumn } from '../types';

const TYPE_COLORS: Record<string, string> = { 'Customer Visit': '#3b82f6', 'Plant Assessment': '#22c55e', 'Technical Service': '#f59e0b' };

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const cls: Record<string, string> = { 'Customer Visit': 'bg-blue-100 text-blue-700', 'Plant Assessment': 'bg-green-100 text-green-700', 'Technical Service': 'bg-yellow-100 text-yellow-700' };
  return <span className={`badge ${cls[type] || 'bg-slate-100 text-slate-600'}`}>{type}</span>;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls: Record<string, string> = { 'Completed': 'badge-active', 'Draft': 'badge-inactive', 'Pending Review': 'badge-prospect' };
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company / Report No', type: 'text', placeholder: 'Search...' },
  { key: 'reportType', label: 'Report Type', type: 'select', options: [
    { value: 'Customer Visit', label: 'Customer Visit' },
    { value: 'Plant Assessment', label: 'Plant Assessment' },
    { value: 'Technical Service', label: 'Technical Service' },
  ]},
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'Completed', label: 'Completed' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Pending Review', label: 'Pending Review' },
  ]},
  { key: 'dateFrom', label: 'From Date', type: 'date' },
  { key: 'dateTo', label: 'To Date', type: 'date' },
];

const columns: TableColumn<Report>[] = [
  { key: 'reportNo', label: 'Report No', width: 'w-32' },
  { key: 'reportType', label: 'Type', width: 'w-36', render: (v) => <TypeBadge type={v as string} /> },
  { key: 'companyName', label: 'Company', width: 'w-52' },
  { key: 'visitDate', label: 'Visit Date', width: 'w-24' },
  { key: 'reporter', label: 'Reporter', width: 'w-28' },
  { key: 'summary', label: 'Summary', width: 'w-64' },
  { key: 'status', label: 'Status', width: 'w-28', render: (v) => <StatusBadge status={v as string} /> },
];

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<Report | null>(null);

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (filters.search && !r.companyName.toLowerCase().includes(filters.search.toLowerCase()) && !r.reportNo.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.reportType && r.reportType !== filters.reportType) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.dateFrom && r.visitDate < filters.dateFrom) return false;
      if (filters.dateTo && r.visitDate > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(r => { counts[r.reportType] = (counts[r.reportType] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: TYPE_COLORS[name] || '#94a3b8', filterKey: 'reportType', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'Report No', value: selected.reportNo },
    { label: 'Report Type', value: <TypeBadge type={selected.reportType} /> },
    { label: 'Company', value: selected.companyName },
    { label: 'Visit Date', value: selected.visitDate },
    { label: 'Reporter', value: selected.reporter },
    { label: 'Status', value: <StatusBadge status={selected.status} /> },
    { label: 'Summary', value: <p className="text-xs leading-relaxed">{selected.summary}</p> },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">報告 — Reports</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {reports.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ New Report</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Scorecard title="Total" value={reports.length} color="blue" />
            <Scorecard title="Done" value={reports.filter(r=>r.status==='Completed').length} color="green" />
            <Scorecard title="Pending" value={reports.filter(r=>r.status==='Pending Review').length} color="orange" />
          </div>
          <DonutChart data={typeData} title="Report Type Distribution" onClick={handleChartClick} height={220} />
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-600 mb-2">Top Reporters</h3>
            {Object.entries(
              reports.reduce((acc: Record<string, number>, r) => ({ ...acc, [r.reporter]: (acc[r.reporter] || 0) + 1 }), {})
            ).sort((a, b) => b[1] - a[1]).map(([name, count], i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600">{name}</span>
                <span className="text-xs font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => setSelected(selected?.id === row.id ? null : row)}
            selectedId={selected?.id}
          />
        </div>
        {selected && (
          <QuickView
            title={selected.reportNo}
            subtitle={selected.companyName}
            fields={quickViewFields}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
