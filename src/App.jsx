import { useState, useMemo } from "react";

export const INITIAL_FILTERS = {
  month: [],
  driverName: [],
  vehicleNumber: [],
  vehicleType: [],
  vendor: [],
  project: [],
  sites: [],
};

export function useFilters(data = []) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const safeData = Array.isArray(data) ? data : [];

  // 🔥 STEP 1: APPLY FILTERS FIRST
  const filteredData = useMemo(() => {
    return safeData.filter((row) => {
      return Object.entries(filters).every(([key, selected]) => {
        if (!selected || selected.length === 0) return true;
        return selected.includes(row?.[key]);
      });
    });
  }, [safeData, filters]);

  // 🔥 STEP 2: BUILD OPTIONS FROM FILTERED DATA (IMPORTANT FIX)
  const filterOptions = useMemo(() => {
    const source = safeData; // ← base dataset for stability

    const unique = (field) => {
      return [
        ...new Set(
          source
            .filter((row) => {
              // 🔥 cascade logic (exclude current filters except self)
              return Object.entries(filters).every(([k, selected]) => {
                if (k === field) return true;
                if (!selected || selected.length === 0) return true;
                return selected.includes(row?.[k]);
              });
            })
            .map((r) => r?.[field])
            .filter(Boolean)
        ),
      ].sort();
    };

    return {
      month: unique("month"),
      driverName: unique("driverName"),
      vehicleNumber: unique("vehicleNumber"),
      vehicleType: unique("vehicleType"),
      vendor: unique("vendor"),
      project: unique("project"),
      sites: unique("sites"),
    };
  }, [safeData, filters]);

  // 🔥 TOGGLE FILTER
  const setFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];

      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const activeFilterCount = Object.values(filters).filter(
    (arr) => arr.length > 0
  ).length;

  return {
    filters,
    filterOptions,
    filteredData,
    setFilter,
    resetFilters,
    activeFilterCount,
  };
}