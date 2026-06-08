import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  formatCurrencyCompact,
  formatCurrency,
  aggregateByField,
  CHART_PALETTE
} from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-slate-500">
        Total Cost:{" "}
        <span className="font-medium text-slate-700">
          {formatCurrency(payload[0]?.value)}
        </span>
      </p>
    </div>
  );
};

export function TopVehiclesChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = aggregateByField(data, "vehicleNumber", ["totalCost"]);

    return grouped
      .map((item) => ({
        name: item.vehicleNumber || item.name,
        totalCost: item.totalCost || 0,
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="font-display font-bold text-slate-800 text-sm">
          Top Vehicles by Cost
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Highest expense vehicles
        </p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
            barSize={14}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />

            <XAxis
              type="number"
              tickFormatter={formatCurrencyCompact}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={64}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="totalCost"
              name="Total Cost"
              radius={[0, 3, 3, 0]}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}