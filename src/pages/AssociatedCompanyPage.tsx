import React, { useState, useMemo } from 'react';
import { associatedCompanies } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { AssociatedCompany, FilterOption, ActiveFilters, TableColumn } from '../types';

const TYPE_COLORS: Record<string, string> = { 'OEM': '#3b82f6', 'Brand Owner': '#22c55e', '加工廠': '#f59e0b', 'Others': '#94a3b8' };

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const cls: Record<string, string> = { 'OEM': 'bg-blue-100 text-blue-700', 'Brand Owner': 'bg-green-100 text-green-700', '加工廠': 'bg-orange-100 text-orange-700', 'Others': 'bg-slate-100 text-slate-700' };
  return <span className={`badge ${cls[type] || 'bg-slate-100 text-slate-700'}`}>{type}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company Name', type: 'text', placeholder: 'Search company...' },
  { key: 'relationType', label: 'Relation Type', type: 'select', options: [
    { value: 'OEM', label: 'OEM' },
    { value: 'Brand Owner', label: 'Brand Owner' },
    { value: '加工廠', label: '加工廠' },
    { value: 'Others', label: 'Others' },
  ]},
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ]},
];

const columns: TableColumn<AssociatedCompany>[] = [
  { key: 'companyName', label: 'Company Name', width: 'w-56' },
  { key: 'relationType', label: 'Relation Type', width: 'w-28', render: (v) => <TypeBadge type={v as string} /> },
  { key: 'associatedCompany', label: 'Associated Company', width: 'w-40' },
  { key: 'status', label: 'Status', width: 'w-20', render: (v) => <span className={`badge ${v === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{v as string}</span> },
];

export const AssociatedCompanyPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<AssociatedCompany | null>(null);

  const filtered = useMemo(() => {
    return associatedCompanies.filter(a => {
      if (filters.search && !a.companyName.toLowerCase().includes(filters.search.toLowerCase()) && !a.associatedCompany.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.relationType && a.relationType !== filters.relationType) return false;
      if (filters.status && a.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(a => { counts[a.relationType] = (counts[a.relationType] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: TYPE_COLORS[name] || '#94a3b8', filterKey: 'relationType', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'Company Name', value: selected.companyName },
    { label: 'Relation Type', value: <TypeBadge type={selected.relationType} /> },
    { label: 'Associated Company', value: selected.associatedCompany },
    { label: 'Status', value: <span className={`badge ${selected.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{selected.status}</span> },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">關聯公司 — Associated Company</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {associatedCompanies.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ Add Association</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Scorecard title="Total" value={associatedCompanies.length} color="blue" />
            <Scorecard title="Active" value={associatedCompanies.filter(a=>a.status==='Active').length} color="green" />
          </div>
          <DonutChart data={typeData} title="Relation Type Distribution" onClick={handleChartClick} height={220} />
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
            title={selected.companyName}
            subtitle={selected.relationType}
            fields={quickViewFields}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
