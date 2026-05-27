import React, { useState, useMemo } from 'react';
import { creditLimits } from '../data/mockData';
import { FilterBar } from '../components/common/FilterBar';
import { Scorecard } from '../components/common/Scorecard';
import { DataTable } from '../components/common/DataTable';
import { QuickView } from '../components/common/QuickView';
import type { CreditLimit, FilterOption, ActiveFilters, TableColumn } from '../types';

const filterConfig: FilterOption[] = [
  { key: 'search', label: 'Company Name', type: 'text', placeholder: 'Search company...' },
  { key: 'currency', label: 'Currency', type: 'select', options: [
    { value: 'HKD', label: 'HKD' },
    { value: 'USD', label: 'USD' },
    { value: 'CNY', label: 'CNY' },
  ]},
  { key: 'extDueFrom', label: 'Ext Due From', type: 'date' },
  { key: 'extDueTo', label: 'Ext Due To', type: 'date' },
  { key: 'intDueFrom', label: 'Int Due From', type: 'date' },
  { key: 'intDueTo', label: 'Int Due To', type: 'date' },
];

const today = new Date().toISOString().split('T')[0];

const columns: TableColumn<CreditLimit>[] = [
  { key: 'companyName', label: 'Company Name', width: 'w-52' },
  { key: 'currency', label: 'CCY', width: 'w-14' },
  { key: 'creditLimit', label: 'Credit Limit', width: 'w-28', render: (v) => <span>{Number(v).toLocaleString()}</span> },
  { key: 'availableCredit', label: 'Available', width: 'w-28', render: (v) => <span className={Number(v) < 50000 ? 'text-red-600 font-medium' : ''}>{Number(v).toLocaleString()}</span> },
  { key: 'totalAR', label: 'Total AR', width: 'w-28', render: (v) => <span className="font-medium">{Number(v).toLocaleString()}</span> },
  { key: 'externalDueDate', label: 'Ext Due Date', width: 'w-28', render: (v) => {
    const isOverdue = v && String(v) < today;
    return <span className={isOverdue ? 'text-red-600 font-medium' : ''}>{String(v)}</span>;
  }},
  { key: 'internalDueDate', label: 'Int Due Date', width: 'w-28', render: (v) => {
    const isOverdue = v && String(v) < today;
    return <span className={isOverdue ? 'text-orange-600 font-medium' : ''}>{String(v)}</span>;
  }},
  { key: 'overdueAmount', label: 'Overdue Amt', width: 'w-28', render: (v) => {
    const n = Number(v);
    return <span className={n > 0 ? 'text-red-600 font-semibold' : 'text-slate-400'}>{n > 0 ? n.toLocaleString() : '—'}</span>;
  }},
  { key: 'lastPaymentDate', label: 'Last Payment', width: 'w-28' },
];

export const CreditLimitPage: React.FC = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [selected, setSelected] = useState<CreditLimit | null>(null);

  const filtered = useMemo(() => {
    return creditLimits.filter(c => {
      if (filters.search && !c.companyName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.currency && c.currency !== filters.currency) return false;
      if (filters.extDueFrom && c.externalDueDate < filters.extDueFrom) return false;
      if (filters.extDueTo && c.externalDueDate > filters.extDueTo) return false;
      if (filters.intDueFrom && c.internalDueDate < filters.intDueFrom) return false;
      if (filters.intDueTo && c.internalDueDate > filters.intDueTo) return false;
      return true;
    });
  }, [filters]);

  const totalARByCC = useMemo(() => ({
    HKD: creditLimits.filter(c=>c.currency==='HKD').reduce((s,c)=>s+c.totalAR,0),
    USD: creditLimits.filter(c=>c.currency==='USD').reduce((s,c)=>s+c.totalAR,0),
    CNY: creditLimits.filter(c=>c.currency==='CNY').reduce((s,c)=>s+c.totalAR,0),
  }), []);

  const totalOverdue = creditLimits.reduce((s,c) => s + c.overdueAmount, 0);
  const alertCount = creditLimits.filter(c => c.hasAlert).length;

  const extDueThisMonth = useMemo(() => {
    const now = new Date();
    return creditLimits.filter(c => {
      const d = new Date(c.externalDueDate);
      return !isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s,c) => s + c.totalAR, 0);
  }, []);

  const intDueThisMonth = useMemo(() => {
    const now = new Date();
    return creditLimits.filter(c => {
      const d = new Date(c.internalDueDate);
      return !isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s,c) => s + c.totalAR, 0);
  }, []);

  const quickViewFields = selected ? [
    { label: 'Company Name', value: selected.companyName },
    { label: 'Currency', value: selected.currency },
    { label: 'Credit Limit', value: selected.creditLimit.toLocaleString() },
    { label: 'Available Credit', value: <span className={selected.availableCredit < 50000 ? 'text-red-600 font-semibold' : ''}>{selected.availableCredit.toLocaleString()}</span> },
    { label: 'Total AR', value: <span className="font-semibold">{selected.totalAR.toLocaleString()}</span> },
    { label: 'External Due Date', value: <span className={selected.externalDueDate < today ? 'text-red-600 font-medium' : ''}>{selected.externalDueDate}</span> },
    { label: 'Internal Due Date', value: <span className={selected.internalDueDate < today ? 'text-orange-600 font-medium' : ''}>{selected.internalDueDate}</span> },
    { label: 'Overdue Amount', value: <span className={selected.overdueAmount > 0 ? 'text-red-600 font-semibold' : 'text-slate-400'}>{selected.overdueAmount > 0 ? selected.overdueAmount.toLocaleString() : '—'}</span> },
    { label: 'Last Payment Date', value: selected.lastPaymentDate },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">信用額度情況 — Credit Limit</h1>
            <p className="text-xs text-slate-500">{filtered.length} of {creditLimits.length} records · {alertCount} alerts</p>
          </div>
        </div>
      </div>
      <FilterBar filters={filterConfig} activeFilters={filters} onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onClearFilters={() => setFilters({})} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 space-y-3">
          <Scorecard
            title="Total AR"
            value={`HKD ${totalARByCC.HKD.toLocaleString()}`}
            color="blue"
            subValues={[
              { label: 'USD', value: totalARByCC.USD.toLocaleString() },
              { label: 'CNY', value: totalARByCC.CNY.toLocaleString() },
            ]}
          />
          <Scorecard
            title="Ext Due This Month"
            value={extDueThisMonth.toLocaleString()}
            color="orange"
            subtitle="Total AR with ext. due this month"
          />
          <Scorecard
            title="Int Due This Month"
            value={intDueThisMonth.toLocaleString()}
            color="purple"
            subtitle="Total AR with int. due this month"
          />
          <Scorecard
            title="Total Overdue"
            value={totalOverdue.toLocaleString()}
            color="red"
            subtitle={`${alertCount} accounts overdue`}
          />
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-600 mb-2">Overdue Accounts</h3>
            {creditLimits.filter(c => c.hasAlert).slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-600 truncate flex-1">{c.companyName.length > 22 ? c.companyName.slice(0,22)+'…' : c.companyName}</span>
                <span className="text-xs font-semibold text-red-600 ml-2">{c.overdueAmount.toLocaleString()}</span>
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
            title={selected.companyName}
            subtitle={selected.currency}
            fields={quickViewFields}
            badge={selected.hasAlert ? <span className="alert-dot" /> : undefined}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};
