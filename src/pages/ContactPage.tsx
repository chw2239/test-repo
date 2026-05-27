import React, { useState, useMemo } from 'react';
import { contacts } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { Contact, FilterOption, ActiveFilters, TableColumn } from '../types';

const WEIGHT_COLORS: Record<string, string> = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' };
const TITLE_COLORS = ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#06b6d4'];

const WeightBadge: React.FC<{ weight: string }> = ({ weight }) => {
  const cls: Record<string, string> = { High: 'bg-red-100 text-red-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' };
  return <span className={`badge ${cls[weight] || 'bg-slate-100 text-slate-600'}`}>{weight}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Contact / Company', type: 'text', placeholder: 'Search name...' },
  { key: 'title', label: 'Job Title', type: 'select', options: [
    { value: 'CEO', label: 'CEO' },
    { value: 'Director', label: 'Director' },
    { value: 'Purchasing Manager', label: 'Purchasing Manager' },
    { value: 'R&D Engineer', label: 'R&D Engineer' },
    { value: 'Quality Manager', label: 'Quality Manager' },
  ]},
  { key: 'decisionWeight', label: 'Decision Weight', type: 'select', options: [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ]},
];

const columns: TableColumn<Contact>[] = [
  { key: 'contactName', label: 'Contact Name', width: 'w-36' },
  { key: 'company', label: 'Company', width: 'w-48' },
  { key: 'title', label: 'Position', width: 'w-36' },
  { key: 'email', label: 'Email', width: 'w-44' },
  { key: 'phone', label: 'Phone', width: 'w-36' },
  { key: 'decisionWeight', label: 'Decision Weight', width: 'w-28', render: (v) => <WeightBadge weight={v as string} /> },
  { key: 'lastVisit', label: 'Last Visit', width: 'w-24' },
];

export const ContactPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (filters.search && !c.contactName.toLowerCase().includes(filters.search.toLowerCase()) && !c.company.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.title && c.title !== filters.title) return false;
      if (filters.decisionWeight && c.decisionWeight !== filters.decisionWeight) return false;
      return true;
    });
  }, [filters]);

  const weightData = useMemo(() => {
    const counts: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
    filtered.forEach(c => { counts[c.decisionWeight]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: WEIGHT_COLORS[name], filterKey: 'decisionWeight', filterValue: name }));
  }, [filtered]);

  const titleData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(c => { counts[c.title] = (counts[c.title] || 0) + 1; });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: TITLE_COLORS[i % TITLE_COLORS.length], filterKey: 'title', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'Contact Name', value: selected.contactName },
    { label: 'Company', value: selected.company },
    { label: 'Title / Position', value: selected.title },
    { label: 'Email', value: <a href={`mailto:${selected.email}`} className="text-blue-500 hover:underline">{selected.email}</a> },
    { label: 'Phone', value: selected.phone },
    { label: 'Decision Weight', value: <WeightBadge weight={selected.decisionWeight} /> },
    { label: 'Last Visit', value: selected.lastVisit },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">聯絡人 — Contacts</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {contacts.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ Add Contact</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Scorecard title="Total" value={contacts.length} color="blue" />
            <Scorecard title="High DW" value={contacts.filter(c=>c.decisionWeight==='High').length} color="red" />
            <Scorecard title="Medium DW" value={contacts.filter(c=>c.decisionWeight==='Medium').length} color="orange" />
          </div>
          <DonutChart data={weightData} title="決策權重 Distribution" onClick={handleChartClick} height={200} />
          <DonutChart data={titleData} title="職位 Distribution" onClick={handleChartClick} height={220} />
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
            title={selected.contactName}
            subtitle={selected.company}
            fields={quickViewFields}
            badge={selected.hasAlert ? <span className="alert-dot" /> : undefined}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
