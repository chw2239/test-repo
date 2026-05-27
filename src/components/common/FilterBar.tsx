import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { FilterOption, ActiveFilters } from '../../types';

interface FilterBarProps {
  filters: FilterOption[];
  activeFilters: ActiveFilters;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, activeFilters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Filter size={14} />
          <span className="text-xs font-medium text-slate-600">Filters:</span>
        </div>
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center">
            {filter.type === 'text' && (
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={filter.placeholder || filter.label}
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="filter-input pl-7 w-44"
                />
              </div>
            )}
            {filter.type === 'select' && (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="filter-input w-44"
              >
                <option value="">{filter.label}</option>
                {filter.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {filter.type === 'date' && (
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="filter-input w-36"
                  title={filter.label}
                />
              </div>
            )}
          </div>
        ))}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <X size={12} />
            Clear Filters
          </button>
        )}
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            const filter = filters.find(f => f.key === key);
            const label = filter?.options?.find(o => o.value === value)?.label || value;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200"
              >
                <span className="text-blue-400">{filter?.label}:</span> {label}
                <button onClick={() => onFilterChange(key, '')} className="ml-0.5 hover:text-blue-900">
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
