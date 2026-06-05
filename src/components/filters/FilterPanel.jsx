import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const FILTER_CONFIG = [
  { key: "month",         label: "Month" },
  { key: "driverName",    label: "Driver" },
  { key: "vehicleNumber", label: "Vehicle" },
  { key: "vehicleType",   label: "Type" },
  { key: "vendor",        label: "Vendor" },
  { key: "project",       label: "Project" },
  { key: "sites",         label: "Site" },
];

export function FilterPanel({ filters, filterOptions, setFilter, resetFilters, activeFilterCount, loading }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Filter className="w-4 h-4 text-fleet-500" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="badge bg-fleet-500 text-white text-xs px-2">
              {activeFilterCount}
            </span>
          )}
          {collapsed ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FILTER_CONFIG.map(({ key, label }) => {
            const options = filterOptions[key] || ["All"];
            const isActive = filters[key] !== "All";

            return (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <select
                    value={filters[key]}
                    onChange={(e) => setFilter(key, e.target.value)}
                    disabled={loading}
                    className={`filter-select pr-7 appearance-none ${
                      isActive ? "border-fleet-400 bg-fleet-50 text-fleet-700 font-medium" : ""
                    }`}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
