import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { Company, FilterOption, ActiveFilters, TableColumn } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Active: '#22c55e', Prospect: '#3b82f6', Blocked: '#ef4444',
};
const REGION_COLORS = ['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#06b6d4','#ec4899'];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls: Record<string, string> = {
    Active: 'badge-active', Prospect: 'badge-prospect', Blocked: 'badge-blocked',
  };
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company Name', type: 'text', placeholder: 'Search company...' },
  { key: 'customerStatus', label: 'Customer Status', type: 'select', options: [
    { value: 'Active', label: 'Active' },
    { value: 'Prospect', label: 'Prospect' },
    { value: 'Blocked', label: 'Blocked' },
  ]},
  { key: 'region', label: 'Region', type: 'select', options: [
    { value: 'Hong Kong', label: 'Hong Kong' },
    { value: 'Guangdong', label: 'Guangdong' },
    { value: 'Shanghai', label: 'Shanghai' },
    { value: 'Zhejiang', label: 'Zhejiang' },
    { value: 'Other China', label: 'Other China' },
    { value: 'Southeast Asia', label: 'Southeast Asia' },
  ]},
  { key: 'bdmName', label: 'BDM', type: 'select', options: [
    { value: 'Peter Chan', label: 'Peter Chan' },
    { value: 'Mary Lam', label: 'Mary Lam' },
    { value: 'Kevin Ng', label: 'Kevin Ng' },
  ]},
];

const columns: TableColumn<Company>[] = [
  { key: 'customerCode', label: 'Customer Code', width: 'w-28' },
  { key: 'companyName', label: 'Company Name', width: 'w-56' },
  { key: 'customerStatus', label: 'Status', width: 'w-24', render: (v) => <StatusBadge status={v as string} /> },
  { key: 'customerClass', label: 'Class', width: 'w-28' },
  { key: 'region', label: 'Region', width: 'w-28' },
  { key: 'bdmName', label: 'BDM', width: 'w-28' },
  { key: 'lastInvoiceDate', label: 'Last Invoice', width: 'w-28' },
  { key: 'groupName', label: 'Group', width: 'w-32' },
];

export const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      if (filters.search && !c.companyName.toLowerCase().includes(filters.search.toLowerCase()) && !c.customerCode.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.customerStatus && c.customerStatus !== filters.customerStatus) return false;
      if (filters.region && c.region !== filters.region) return false;
      if (filters.bdmName && c.bdmName !== filters.bdmName) return false;
      return true;
    });
  }, [filters]);

  const statusData = useMemo(() => {
    const counts = { Active: 0, Prospect: 0, Blocked: 0 };
    filtered.forEach(c => { counts[c.customerStatus]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name], filterKey: 'customerStatus', filterValue: name }));
  }, [filtered]);

  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(c => { counts[c.region] = (counts[c.region] || 0) + 1; });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: REGION_COLORS[i % REGION_COLORS.length], filterKey: 'region', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const newThisMonth = useMemo(() => {
    const now = new Date();
    return companies.filter(c => {
      if (!c.lastInvoiceDate) return false;
      const d = new Date(c.lastInvoiceDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, []);

  const quickViewFields = selectedCompany ? [
    { label: 'Customer Code', value: selectedCompany.customerCode },
    { label: 'Customer Status', value: <StatusBadge status={selectedCompany.customerStatus} /> },
    { label: 'Customer Class', value: selectedCompany.customerClass },
    { label: 'BDM PIC', value: selectedCompany.bdmName },
    { label: 'Group Name', value: selectedCompany.groupName },
    { label: 'Group Status', value: selectedCompany.groupStatus },
    { label: 'Converted to Customer', value: selectedCompany.isConvertToCustomer ? 'Yes' : 'No' },
    { label: 'Last Invoice Date', value: selectedCompany.lastInvoiceDate },
    { label: 'Last Visit Date', value: selectedCompany.lastVisitDate },
    { label: 'Last Follow-up', value: selectedCompany.lastFollowUpDate },
    { label: 'Industry', value: selectedCompany.industry },
    { label: 'District', value: selectedCompany.district },
    { label: 'Country', value: selectedCompany.country },
    { label: 'City', value: selectedCompany.city },
    { label: 'Street', value: selectedCompany.street },
    { label: 'Region', value: selectedCompany.region },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">公司 — Company</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {companies.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ Add Company</button>
        </div>
      </div>

      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      {/* Main 3-panel content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: dashboard */}
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Scorecard title="Total" value={companies.length} color="blue" />
            <Scorecard title="Active" value={companies.filter(c=>c.customerStatus==='Active').length} color="green" />
            <Scorecard title="Prospect" value={companies.filter(c=>c.customerStatus==='Prospect').length} color="purple" />
            <Scorecard title="New / Month" value={newThisMonth} color="orange" />
          </div>
          <DonutChart data={statusData} title="Customer Status" onClick={handleChartClick} height={200} />
          <DonutChart data={regionData} title="地區 Distribution" onClick={handleChartClick} height={220} />
        </div>

        {/* Middle: table */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => setSelectedCompany(selectedCompany?.id === row.id ? null : row)}
            selectedId={selectedCompany?.id}
          />
        </div>

        {/* Right: quick view */}
        {selectedCompany && (
          <QuickView
            title={selectedCompany.companyName}
            subtitle={selectedCompany.customerCode}
            fields={quickViewFields}
            badge={selectedCompany.hasAlert ? <span className="alert-dot" title="Needs attention" /> : undefined}
            onClose={() => setSelectedCompany(null)}
            onExpand={() => navigate(`/company/${selectedCompany.id}`)}
          />
        )}
      </div>
    </div>
  );
};
