import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartDataItem } from '../../types';

interface DonutChartProps {
  data: ChartDataItem[];
  title: string;
  total?: number;
  onClick?: (filterKey: string, filterValue: string) => void;
  height?: number;
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartDataItem }> }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-slate-800">{item.name}</p>
        <p className="text-slate-600">{item.value.toLocaleString()} records</p>
      </div>
    );
  }
  return null;
};

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, total, onClick, height = 220 }) => {
  const handleClick = (entry: ChartDataItem) => {
    if (onClick && entry.filterKey && entry.filterValue) {
      onClick(entry.filterKey, entry.filterValue);
    }
  };

  const totalVal = total ?? data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{title}</h3>
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={height * 0.22}
              outerRadius={height * 0.36}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              onClick={(entry) => handleClick(entry as ChartDataItem)}
              style={{ cursor: onClick ? 'pointer' : 'default' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
              formatter={(value) => <span className="text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {totalVal > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-8%' }}>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-800">{totalVal}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
