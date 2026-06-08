import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  formatCurrencyCompact,
  formatCurrency,
  aggregateByField,
  sortByMonth
} from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-fleet-500" />
        <span className="text-slate-500">Total Cost:</span>
        <span className="font-medium text-slate-700">
          {formatCurrency(payload[0]?.value)}
        </span>
      </div>
    </div>
  );
};

export function MonthlyTrendChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = aggregateByField(data, "month", [
      "totalCost",
      "monthlyBilling",
    ]);

    return sortByMonth(grouped).map((item) => ({
      name: item.month || item.name,   // 🔥 FIX HERE
      totalCost: item.totalCost || 0,
      monthlyBilling: item.monthlyBilling || 0,
    }));
  }, [data]);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-bold text-slate-800 text-sm">
          Monthly Expense Trend
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Total operational cost
        </p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            
            <defs>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={formatCurrencyCompact}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={56}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="totalCost"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#costGrad)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Area
              type="monotone"
              dataKey="monthlyBilling"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#billingGrad)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-fleet-500 inline-block" />
          <span className="text-xs text-slate-400">Total Cost</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-emerald-500 inline-block" />
          <span className="text-xs text-slate-400">Billing</span>
        </div>
      </div>
    </div>
  );
}