import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';

interface QuickViewProps {
  title: string;
  subtitle?: string;
  fields: { label: string; value: React.ReactNode }[];
  onClose: () => void;
  onExpand?: () => void;
  badge?: React.ReactNode;
}

export const QuickView: React.FC<QuickViewProps> = ({ title, subtitle, fields, onClose, onExpand, badge }) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 slide-in-right" style={{ width: 360 }}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate" title={title}>{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="Expand to full view"
            >
              <ArrowUpRight size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-1 gap-0">
          {fields.map((field, i) => (
            <div
              key={i}
              className={`flex py-2 ${i < fields.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <span className="text-xs text-slate-400 font-medium w-36 flex-shrink-0 mt-0.5">{field.label}</span>
              <span className="text-xs text-slate-700 flex-1 min-w-0 break-words">{field.value || <span className="text-slate-300">—</span>}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
