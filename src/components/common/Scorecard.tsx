import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScorecardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  currency?: 'HKD' | 'USD' | 'CNY';
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  subValues?: { label: string; value: string | number }[];
}

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', title: 'text-blue-600', value: 'text-blue-900', icon: 'text-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-100', title: 'text-green-600', value: 'text-green-900', icon: 'text-green-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100', title: 'text-orange-600', value: 'text-orange-900', icon: 'text-orange-500' },
  red: { bg: 'bg-red-50', border: 'border-red-100', title: 'text-red-600', value: 'text-red-900', icon: 'text-red-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', title: 'text-purple-600', value: 'text-purple-900', icon: 'text-purple-500' },
};

export const Scorecard: React.FC<ScorecardProps> = ({
  title, value, subtitle, currency, trend = 'neutral', trendLabel, color = 'blue', subValues,
}) => {
  const c = colorMap[color];
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400';

  const formatVal = (v: string | number) => {
    if (typeof v === 'number') return v.toLocaleString();
    return v;
  };

  return (
    <div className={`scorecard ${c.bg} border ${c.border}`}>
      <div className="flex items-start justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wider ${c.title}`}>{title}</p>
        {currency && <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${c.bg} ${c.title} border ${c.border}`}>{currency}</span>}
      </div>
      <div className="flex items-end justify-between mt-1">
        <p className={`text-2xl font-bold ${c.value}`}>{formatVal(value)}</p>
        {trendLabel && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon size={12} />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      {subValues && subValues.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
          {subValues.map((sv, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-slate-500">{sv.label}</span>
              <span className="font-medium text-slate-700">{typeof sv.value === 'number' ? sv.value.toLocaleString() : sv.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
