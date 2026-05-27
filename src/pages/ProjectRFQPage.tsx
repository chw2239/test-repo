import React, { useState, useMemo } from 'react';
import { projectRFQs } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { ProjectRFQ, FilterOption, ActiveFilters, TableColumn } from '../types';

const OUTCOME_COLORS: Record<string, string> = { Win: '#22c55e', Loss: '#ef4444', Ongoing: '#3b82f6', Pending: '#f59e0b' };
const INDUSTRY_COLORS: Record<string, string> = { 'Medical Device': '#8b5cf6', 'Consumer Electronics': '#3b82f6', 'Automotive Parts': '#f59e0b', 'Household Appliances': '#06b6d4', 'Electronics': '#ec4899' };
const LEVEL_COLORS: Record<string, string> = { A: '#ef4444', B: '#f59e0b', C: '#22c55e', D: '#94a3b8' };

const OutcomeBadge: React.FC<{ outcome: string }> = ({ outcome }) => {
  const cls: Record<string, string> = { Win: 'bg-green-100 text-green-700', Loss: 'bg-red-100 text-red-700', Ongoing: 'bg-blue-100 text-blue-700', Pending: 'bg-yellow-100 text-yellow-700' };
  return <span className={`badge ${cls[outcome] || 'bg-slate-100 text-slate-600'}`}>{outcome}</span>;
};

const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const cls: Record<string, string> = { A: 'bg-red-100 text-red-700', B: 'bg-yellow-100 text-yellow-700', C: 'bg-green-100 text-green-700', D: 'bg-slate-100 text-slate-600' };
  return <span className={`badge ${cls[level] || 'bg-slate-100 text-slate-600'}`}>{level}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company / RFQ No', type: 'text', placeholder: 'Search...' },
  { key: 'projectIndustry', label: 'Industry', type: 'select', options: [
    { value: 'Medical Device', label: 'Medical Device' },
    { value: 'Consumer Electronics', label: 'Consumer Electronics' },
    { value: 'Automotive Parts', label: 'Automotive Parts' },
    { value: 'Household Appliances', label: 'Household Appliances' },
    { value: 'Electronics', label: 'Electronics' },
  ]},
  { key: 'projectOutcome', label: 'Outcome', type: 'select', options: [
    { value: 'Win', label: 'Win' },
    { value: 'Loss', label: 'Loss' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Pending', label: 'Pending' },
  ]},
  { key: 'projectLevel', label: 'Level', type: 'select', options: [
    { value: 'A', label: 'A - Strategic' },
    { value: 'B', label: 'B - Major' },
    { value: 'C', label: 'C - Regular' },
    { value: 'D', label: 'D - Small' },
  ]},
];

const columns: TableColumn<ProjectRFQ>[] = [
  { key: 'rfqNo', label: 'RFQ No', width: 'w-32' },
  { key: 'projectDate', label: 'Date', width: 'w-24' },
  { key: 'customerCode', label: 'Cust. Code', width: 'w-24' },
  { key: 'customerEngName', label: 'Company', width: 'w-48' },
  { key: 'manufacturer', label: 'Manufacturer', width: 'w-24' },
  { key: 'brand', label: 'Brand', width: 'w-24' },
  { key: 'type', label: 'Type', width: 'w-20' },
  { key: 'grade', label: 'Grade', width: 'w-24' },
  { key: 'projectOutcome', label: 'Outcome', width: 'w-24', render: (v) => <OutcomeBadge outcome={v as string} /> },
  { key: 'projectLevel', label: 'Level', width: 'w-16', render: (v) => <LevelBadge level={v as string} /> },
  { key: 'endUserName', label: 'End User', width: 'w-32' },
];

export const ProjectRFQPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<ProjectRFQ | null>(null);

  const filtered = useMemo(() => {
    return projectRFQs.filter(p => {
      if (filters.search && !p.customerEngName.toLowerCase().includes(filters.search.toLowerCase()) && !p.rfqNo.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.projectIndustry && p.projectIndustry !== filters.projectIndustry) return false;
      if (filters.projectOutcome && p.projectOutcome !== filters.projectOutcome) return false;
      if (filters.projectLevel && p.projectLevel !== filters.projectLevel) return false;
      return true;
    });
  }, [filters]);

  const outcomeData = useMemo(() => {
    const counts: Record<string, number> = { Win: 0, Loss: 0, Ongoing: 0, Pending: 0 };
    filtered.forEach(p => { counts[p.projectOutcome]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: OUTCOME_COLORS[name], filterKey: 'projectOutcome', filterValue: name }));
  }, [filtered]);

  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(p => { counts[p.projectIndustry] = (counts[p.projectIndustry] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: INDUSTRY_COLORS[name] || '#94a3b8', filterKey: 'projectIndustry', filterValue: name }));
  }, [filtered]);

  const levelData = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    filtered.forEach(p => { counts[p.projectLevel]++; });
    return Object.entries(counts).map(([name, value]) => ({ name: `Level ${name}`, value, color: LEVEL_COLORS[name], filterKey: 'projectLevel', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    // level chart sends "Level A" etc.
    const actualValue = value.startsWith('Level ') ? value.replace('Level ', '') : value;
    setFilters(f => {
      const currentVal = f[key];
      return { ...f, [key]: currentVal === actualValue ? '' : actualValue };
    });
  };

  const quickViewFields = selected ? [
    { label: 'RFQ No', value: selected.rfqNo },
    { label: 'Project Date', value: selected.projectDate },
    { label: 'Customer Code', value: selected.customerCode },
    { label: 'Customer (Eng)', value: selected.customerEngName },
    { label: 'Customer (Chi)', value: selected.customerChiName },
    { label: 'Manufacturer', value: selected.manufacturer },
    { label: 'Brand', value: selected.brand },
    { label: 'Type / Grade', value: `${selected.type} / ${selected.grade}` },
    { label: 'Shade', value: selected.shade },
    { label: 'Color Code', value: selected.colorCode },
    { label: 'Color Description', value: selected.colorDescription },
    { label: 'Industry', value: selected.projectIndustry },
    { label: 'Outcome', value: <OutcomeBadge outcome={selected.projectOutcome} /> },
    { label: 'Project Level', value: <LevelBadge level={selected.projectLevel} /> },
    { label: 'End User', value: selected.endUserName },
    { label: 'RFQ Completed', value: selected.rfqCompletedDate || '—' },
    { label: 'Created Date', value: selected.createdDate },
    { label: 'Modified Date', value: selected.modifiedDate },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">項目/RFQ — Projects & RFQ</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {projectRFQs.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ New RFQ</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Scorecard title="Win" value={projectRFQs.filter(p=>p.projectOutcome==='Win').length} color="green" />
            <Scorecard title="Loss" value={projectRFQs.filter(p=>p.projectOutcome==='Loss').length} color="red" />
            <Scorecard title="Ongoing" value={projectRFQs.filter(p=>p.projectOutcome==='Ongoing').length} color="blue" />
            <Scorecard title="Pending" value={projectRFQs.filter(p=>p.projectOutcome==='Pending').length} color="orange" />
          </div>
          <DonutChart data={outcomeData} title="Project Outcome" onClick={handleChartClick} height={200} />
          <DonutChart data={industryData} title="Industry Distribution" onClick={handleChartClick} height={220} />
          <DonutChart data={levelData} title="Project Level" onClick={handleChartClick} height={200} />
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
            title={selected.rfqNo}
            subtitle={selected.customerEngName}
            fields={quickViewFields}
            badge={selected.hasAlert ? <span className="alert-dot" /> : undefined}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
