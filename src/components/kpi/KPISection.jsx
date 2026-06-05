import React from "react";
import {
  DollarSign, Wallet, Fuel, Clock, MapPin,
  Navigation, Truck, Users
} from "lucide-react";
import { formatCurrencyCompact, formatCompact, computeKPIs } from "../../utils/helpers";

const KPI_CONFIG = [
  {
    key: "totalAmount",
    label: "Total Billing",
    icon: DollarSign,
    color: "blue",
    format: formatCurrencyCompact,
    description: "Monthly billing amount",
  },
  {
    key: "totalFixedSalary",
    label: "Fixed Salaries",
    icon: Wallet,
    color: "violet",
    format: formatCurrencyCompact,
    description: "Total salary cost",
  },
  {
    key: "totalFuelCost",
    label: "Fuel Cost",
    icon: Fuel,
    color: "amber",
    format: formatCurrencyCompact,
    description: "Total fuel expense",
  },
  {
    key: "totalOT",
    label: "OT Amount",
    icon: Clock,
    color: "rose",
    format: formatCurrencyCompact,
    description: "Overtime payments",
  },
  {
    key: "totalOutOfCity",
    label: "Out of City",
    icon: MapPin,
    color: "teal",
    format: formatCurrencyCompact,
    description: "Out-of-city travel cost",
  },
  {
    key: "totalKM",
    label: "Total KM",
    icon: Navigation,
    color: "indigo",
    format: (v) => `${formatCompact(v)} km`,
    description: "Distance covered",
  },
  {
    key: "totalVehicles",
    label: "Vehicles",
    icon: Truck,
    color: "sky",
    format: (v) => String(v),
    description: "Active vehicles",
  },
  {
    key: "totalDrivers",
    label: "Drivers",
    icon: Users,
    color: "emerald",
    format: (v) => String(v),
    description: "Active drivers",
  },
];

const COLOR_MAP = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  violet:  { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  rose:    { bg: "bg-rose-50 dark:bg-rose-900/20", icon: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
  teal:    { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500" },
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
  sky:     { bg: "bg-sky-50 dark:bg-sky-900/20", icon: "text-sky-600 dark:text-sky-400", dot: "bg-sky-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
};

function KPICard({ config, value, loading }) {
  const { label, icon: Icon, color, format, description } = config;
  const c = COLOR_MAP[color];
  const displayValue = loading ? null : format(value);

  return (
    <div className="kpi-card bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

      {/* ICON */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div className={`w-2 h-2 rounded-full ${c.dot}`} />
      </div>

      {/* VALUE */}
      <div className="mt-3">
        {loading ? (
          <>
            <div className="skeleton h-7 w-24 mb-1" />
            <div className="skeleton h-3.5 w-20" />
          </>
        ) : (
          <>
            {/* ✅ FIX: DARK MODE TEXT */}
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {displayValue}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">
              {label}
            </p>
          </>
        )}
      </div>

      {/* DESCRIPTION */}
      {!loading && (
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 truncate">
          {description}
        </p>
      )}
    </div>
  );
}

export function KPISection({ data, loading }) {
  const kpis = computeKPIs(data);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-slate-800 dark:text-white text-base">
          Key Metrics
        </h2>

        <span className="badge bg-fleet-50 dark:bg-slate-700 text-fleet-600 dark:text-white">
          {data.length} records
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {KPI_CONFIG.map((cfg) => (
          <KPICard
            key={cfg.key}
            config={cfg}
            value={kpis[cfg.key]}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}