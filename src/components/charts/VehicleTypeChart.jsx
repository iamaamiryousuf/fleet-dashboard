import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { CHART_PALETTE, formatCurrency } from "../../utils/helpers";

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{name}</p>
      <p className="text-slate-500">Total Cost: <span className="font-medium text-slate-700">{formatCurrency(value)}</span></p>
    </div>
  );
};

export function VehicleTypeChart({ data }) {
  const chartData = useMemo(() => {
    const map = {};
    data.forEach((r) => {
      const t = r.vehicleType || "Unknown";
      map[t] = (map[t] || 0) + r.totalCost;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="card p-5 flex flex-col items-center justify-center min-h-[280px]">
        <p className="text-sm text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-bold text-slate-800 text-sm">Vehicle Type Distribution</h3>
        <p className="text-xs text-slate-400 mt-0.5">Cost share by vehicle category</p>
      </div>
      <div className="chart-wrapper flex flex-col items-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
          {chartData.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }}
              />
              <span className="text-xs text-slate-500">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
