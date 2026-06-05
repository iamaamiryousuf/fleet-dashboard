import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { formatCurrencyCompact, formatCurrency, aggregateByField, sortByMonth } from "../../utils/helpers";

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

export function ExpenseBreakdownChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = aggregateByField(data, "month", [
      "fixedSalary", "fuelCost", "otAmount", "outOfCityAmount"
    ]);
    return sortByMonth(grouped);
  }, [data]);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-bold text-slate-800 text-sm">Expense Breakdown by Month</h3>
        <p className="text-xs text-slate-400 mt-0.5">Fixed Salary · Fuel · OT · Out-of-City</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={14} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={56} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="fixedSalary" name="Fixed Salary" fill="#6366f1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="fuelCost"    name="Fuel Cost"    fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="otAmount"    name="OT Amount"    fill="#ef4444" radius={[3, 3, 0, 0]} />
            <Bar dataKey="outOfCityAmount" name="Out-of-City" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
