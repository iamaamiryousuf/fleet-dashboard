import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const FILTER_CONFIG = [
  { key: "month", label: "Month" },
  { key: "driverName", label: "Driver" },
  { key: "vehicleNumber", label: "Vehicle" },
  { key: "vehicleType", label: "Type" },
  { key: "vendor", label: "Vendor" },
  { key: "project", label: "Project" },
  { key: "sites", label: "Site" },
];

export function FilterPanel({
  filters,
  filterOptions,
  setFilter,
  resetFilters,
  activeFilterCount,
  loading
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleValue = (key, value) => {
    const current = filters[key] || [];

    let updated;
    if (current.includes(value)) {
      updated = current.filter((v) => v !== value);
    } else {
      updated = [...current, value];
    }

    setFilter(key, updated);
  };

  const isSelected = (key, value) => {
    return (filters[key] || []).includes(value);
  };

  return (
    <div className="card p-4">
      {/* Header */}
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
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      {!collapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FILTER_CONFIG.map(({ key, label }) => {
            const options = filterOptions[key] || ["All"];

            return (
              <div key={key} className="relative">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {label}
                </label>

                {/* Dropdown Button */}
                <button
                  disabled={loading}
                  onClick={() =>
                    setOpenDropdown(openDropdown === key ? null : key)
                  }
                  className="filter-select text-left flex justify-between items-center"
                >
                  <span>
                    {(filters[key] || []).length > 0
                      ? `${filters[key].length} selected`
                      : "All"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === key && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {options.map((opt) => {
                      if (opt === "All") return null;

                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected(key, opt)}
                            onChange={() => toggleValue(key, opt)}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}