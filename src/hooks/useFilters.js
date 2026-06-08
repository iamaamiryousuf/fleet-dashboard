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

  // 🔥 OPTIONS (dynamic like Excel)
  const filterOptions = useMemo(() => {
    const unique = (field) => {
      const vals = [
        ...new Set(safeData.map((r) => r?.[field]).filter(Boolean)),
      ].sort();

      return vals;
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
  }, [safeData]);

  // 🔥 FILTER ENGINE (MULTI SELECT LOGIC)
  const filteredData = useMemo(() => {
    return safeData.filter((row) => {
      return Object.entries(filters).every(([key, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) return true;

        return selectedValues.includes(row?.[key]);
      });
    });
  }, [safeData, filters]);

  // 🔥 SET FILTER (multi-select toggle support)
  const setFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];

      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const activeFilterCount = Object.values(filters).reduce(
    (acc, arr) => acc + (arr.length > 0 ? 1 : 0),
    0
  );

  return {
    filters,
    filterOptions,
    filteredData,
    setFilter,
    resetFilters,
    activeFilterCount,
  };
}