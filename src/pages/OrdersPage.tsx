import React, { useState, useMemo } from 'react';
import { orders } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { Scorecard } from '../components/common/Scorecard';
import { DonutChart } from '../components/common/DonutChart';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { Order, FilterOption, ActiveFilters, TableColumn } from '../types';

const STATUS_COLORS: Record<string, string> = { Delivered: '#22c55e', 'In Transit': '#3b82f6', Processing: '#f59e0b', Overdue: '#ef4444' };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls: Record<string, string> = { Delivered: 'badge-active', 'In Transit': 'badge-prospect', Processing: 'bg-yellow-100 text-yellow-700', Overdue: 'badge-blocked' };
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>;
};

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company / SO No', type: 'text', placeholder: 'Search...' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'Delivered', label: 'Delivered' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Overdue', label: 'Overdue' },
  ]},
  { key: 'dateFrom', label: 'Delivery From', type: 'date' },
  { key: 'dateTo', label: 'Delivery To', type: 'date' },
];

const columns: TableColumn<Order>[] = [
  { key: 'soNo', label: 'SO No', width: 'w-32' },
  { key: 'companyName', label: 'Company', width: 'w-52' },
  { key: 'material', label: 'Material', width: 'w-32' },
  { key: 'quantity', label: 'Qty (Kg)', width: 'w-24', render: (v) => <span>{Number(v).toLocaleString()}</span> },
  { key: 'unitPrice', label: 'Unit Price', width: 'w-24', render: (v) => <span>HKD {Number(v).toLocaleString()}</span> },
  { key: 'totalAmount', label: 'Total Amount', width: 'w-32', render: (v) => <span className="font-medium">HKD {Number(v).toLocaleString()}</span> },
  { key: 'deliveryDate', label: 'Delivery Date', width: 'w-28' },
  { key: 'status', label: 'Status', width: 'w-24', render: (v) => <StatusBadge status={v as string} /> },
];

export const OrdersPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (filters.search && !o.companyName.toLowerCase().includes(filters.search.toLowerCase()) && !o.soNo.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.dateFrom && o.deliveryDate < filters.dateFrom) return false;
      if (filters.dateTo && o.deliveryDate > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Delivered: 0, 'In Transit': 0, Processing: 0, Overdue: 0 };
    filtered.forEach(o => { counts[o.status]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: STATUS_COLORS[name], filterKey: 'status', filterValue: name }));
  }, [filtered]);

  const totalThisMonth = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const d = new Date(o.deliveryDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, []);

  const handleChartClick = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }));
  };

  const quickViewFields = selected ? [
    { label: 'SO No', value: selected.soNo },
    { label: 'Company', value: selected.companyName },
    { label: 'Material', value: selected.material },
    { label: 'Quantity', value: `${selected.quantity.toLocaleString()} Kg` },
    { label: 'Unit Price', value: `HKD ${selected.unitPrice.toLocaleString()}` },
    { label: 'Total Amount', value: <span className="font-semibold">HKD {selected.totalAmount.toLocaleString()}</span> },
    { label: 'Delivery Date', value: selected.deliveryDate },
    { label: 'Status', value: <StatusBadge status={selected.status} /> },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">訂單 — Orders</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {orders.length} records</p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">+ New Order</button>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Scorecard title="Total Orders" value={orders.length} color="blue" />
            <Scorecard title="This Month" value={totalThisMonth} color="green" />
            <Scorecard title="Ongoing" value={orders.filter(o=>o.status==='In Transit'||o.status==='Processing').length} color="orange" />
            <Scorecard title="Overdue" value={orders.filter(o=>o.status==='Overdue').length} color="red" />
          </div>
          <DonutChart data={statusData} title="Order Status" onClick={handleChartClick} height={200} />
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-600 mb-2">Total Value (HKD)</h3>
            <p className="text-xl font-bold text-slate-800">{orders.reduce((s,o)=>s+o.totalAmount,0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Overdue: <span className="text-red-600 font-semibold">{orders.filter(o=>o.hasAlert).reduce((s,o)=>s+o.totalAmount,0).toLocaleString()}</span></p>
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
            title={selected.soNo}
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
