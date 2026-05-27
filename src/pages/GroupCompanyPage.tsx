import React, { useState, useMemo } from 'react';
import { groupCompanies } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { GroupCompany, FilterOption, ActiveFilters, TableColumn } from '../types';

const STATUS_COLORS: Record<string, string> = { Active: '#22c55e', Inactive: '#94a3b8', Prospect: '#3b82f6' };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls: Record<string, string> = { Active: 'badge-active', Inactive: 'badge-inactive', Prospect: 'badge-prospect' };
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Group Name', type: 'text', placeholder: 'Search group...' },
  { key: 'groupStatus', label: 'Group Status', type: 'select', options: [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Prospect', label: 'Prospect' },
  ]},
  { key: 'primaryRegion', label: 'Region', type: 'select', options: [
    { value: 'Hong Kong', label: 'Hong Kong' },
    { value: 'Guangdong', label: 'Guangdong' },
    { value: 'Shanghai', label: 'Shanghai' },
    { value: 'Zhejiang', label: 'Zhejiang' },
    { value: 'Southeast Asia', label: 'Southeast Asia' },
  ]},
];

const columns: TableColumn<GroupCompany>[] = [
  { key: 'groupCode', label: 'Group Code', width: 'w-28' },
  { key: 'groupName', label: 'Group Name', width: 'w-48' },
  { key: 'groupStatus', label: 'Status', width: 'w-24', render: (v) => <StatusBadge status={v as string} /> },
  { key: 'memberCount', label: 'Members', width: 'w-20' },
  { key: 'primaryRegion', label: 'Region', width: 'w-32' },
  { key: 'bdmName', label: 'BDM', width: 'w-28' },
];

export const GroupCompanyPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<GroupCompany | null>(null);

  const filtered = useMemo(() => {
    return groupCompanies.filter(g => {
      if (filters.search && !g.groupName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.groupStatus && g.groupStatus !== filters.groupStatus) return false;
      if (filters.primaryRegion && g.primaryRegion !== filters.primaryRegion) return false;
      return true;
    });
  }, [filters]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0, Prospect: 0 };
    filtered.forEach(g => { counts[g.groupStatus]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name], filterKey: 'groupStatus', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'Group Code', value: selected.groupCode },
    { label: 'Group Status', value: <StatusBadge status={selected.groupStatus} /> },
    { label: 'Member Count', value: selected.memberCount },
    { label: 'Primary Region', value: selected.primaryRegion },
    { label: 'BDM', value: selected.bdmName },
    { label: 'Members', value: (
      <div className="space-y-0.5">
        {selected.members.map((m, i) => <div key={i} className="text-xs bg-slate-50 px-2 py-0.5 rounded">{m}</div>)}
      </div>
    )},
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">集團公司 — Group Company</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {groupCompanies.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ Add Group</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Scorecard title="Total" value={groupCompanies.length} color="blue" />
            <Scorecard title="Active" value={groupCompanies.filter(g=>g.groupStatus==='Active').length} color="green" />
            <Scorecard title="Prospect" value={groupCompanies.filter(g=>g.groupStatus==='Prospect').length} color="purple" />
          </div>
          <DonutChart data={statusData} title="Group Status" onClick={handleChartClick} height={220} />
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-600 mb-2">Top Groups by Members</h3>
            {[...groupCompanies].sort((a,b) => b.memberCount - a.memberCount).slice(0,5).map((g,i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600 truncate flex-1">{g.groupName}</span>
                <span className="text-xs font-semibold text-blue-600 ml-2">{g.memberCount}</span>
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
            title={selected.groupName}
            subtitle={selected.groupCode}
            fields={quickViewFields}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
