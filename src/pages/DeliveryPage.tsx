import React, { useState, useMemo } from 'react';
import { deliveries } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { DonutChart } from '../components/common/DonutChart';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { Delivery, FilterOption, ActiveFilters, TableColumn } from '../types';

const STATUS_COLORS: Record<string, string> = { Delivered: '#22c55e', 'In Transit': '#3b82f6', Pending: '#f59e0b', Returned: '#ef4444' };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls: Record<string, string> = { Delivered: 'badge-active', 'In Transit': 'badge-prospect', Pending: 'bg-yellow-100 text-yellow-700', Returned: 'badge-blocked' };
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company / Invoice No', type: 'text', placeholder: 'Search...' },
  { key: 'deliveryStatus', label: 'Status', type: 'select', options: [
    { value: 'Delivered', label: 'Delivered' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Returned', label: 'Returned' },
  ]},
  { key: 'dateFrom', label: 'Ship From', type: 'date' },
  { key: 'dateTo', label: 'Ship To', type: 'date' },
];

const columns: TableColumn<Delivery>[] = [
  { key: 'invoiceNo', label: 'Invoice No', width: 'w-32' },
  { key: 'soNo', label: 'SO No', width: 'w-28' },
  { key: 'companyName', label: 'Company', width: 'w-52' },
  { key: 'shipDate', label: 'Ship Date', width: 'w-24' },
  { key: 'trackingNo', label: 'Tracking No', width: 'w-36' },
  { key: 'deliveryStatus', label: 'Status', width: 'w-24', render: (v) => <StatusBadge status={v as string} /> },
  { key: 'remarks', label: 'Remarks', width: 'w-52' },
];

export const DeliveryPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<Delivery | null>(null);

  const filtered = useMemo(() => {
    return deliveries.filter(d => {
      if (filters.search && !d.companyName.toLowerCase().includes(filters.search.toLowerCase()) && !d.invoiceNo.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.deliveryStatus && d.deliveryStatus !== filters.deliveryStatus) return false;
      if (filters.dateFrom && d.shipDate < filters.dateFrom) return false;
      if (filters.dateTo && d.shipDate > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Delivered: 0, 'In Transit': 0, Pending: 0, Returned: 0 };
    filtered.forEach(d => { counts[d.deliveryStatus]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name], filterKey: 'deliveryStatus', filterValue: name }));
  }, [filtered]);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'Invoice No', value: selected.invoiceNo },
    { label: 'SO No', value: selected.soNo },
    { label: 'Company', value: selected.companyName },
    { label: 'Ship Date', value: selected.shipDate },
    { label: 'Tracking No', value: <span className="font-mono">{selected.trackingNo}</span> },
    { label: 'Status', value: <StatusBadge status={selected.deliveryStatus} /> },
    { label: 'Remarks', value: selected.remarks },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">送貨 — Delivery</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {deliveries.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ New Delivery</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Scorecard title="Total" value={deliveries.length} color="blue" />
            <Scorecard title="Delivered" value={deliveries.filter(d=>d.deliveryStatus==='Delivered').length} color="green" />
            <Scorecard title="In Transit" value={deliveries.filter(d=>d.deliveryStatus==='In Transit').length} color="orange" />
            <Scorecard title="Returned" value={deliveries.filter(d=>d.deliveryStatus==='Returned').length} color="red" />
          </div>
          <DonutChart data={statusData} title="Delivery Status" onClick={handleChartClick} height={220} />
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
            title={selected.invoiceNo}
            subtitle={selected.companyName}
            fields={quickViewFields}
            badge={selected.hasAlert ? <span className="alert-dot" /> : undefined}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
