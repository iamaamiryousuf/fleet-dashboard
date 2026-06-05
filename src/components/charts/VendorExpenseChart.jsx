import React, { useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import { formatCurrencyCompact, formatCurrency, aggregateByField, CHART_PALETTE } from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-medium text-slate-700">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function VendorExpenseChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = aggregateByField(data, "vendor", [
      "fixedSalary", "fuelCost", "otAmount", "outOfCityAmount", "totalCost"
    ]);
    return grouped.sort((a, b) => b.totalCost - a.totalCost);
  }, [data]);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-bold text-slate-800 text-sm">Vendor Expense Analysis</h3>
        <p className="text-xs text-slate-400 mt-0.5">Cost breakdown by vendor</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={56} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalCost" name="Total Cost" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
