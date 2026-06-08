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

  // 🔥 STEP 1: APPLY FILTERS (BASE DATA)
  const baseFilteredData = useMemo(() => {
    if (!safeData.length) return [];

    return safeData.filter((row) => {
      return Object.entries(filters).every(([key, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) return true;
        return selectedValues.includes(row?.[key]);
      });
    });
  }, [safeData, filters]);

  // 🔥 STEP 2: CASCADING OPTIONS (Excel-style)
  const filterOptions = useMemo(() => {
    const unique = (field) => {
      return [
        ...new Set(
          baseFilteredData
            .map((r) => r?.[field])
            .filter((v) => v !== null && v !== undefined && v !== "")
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
  }, [baseFilteredData]);

  // 🔥 STEP 3: FINAL OUTPUT DATA
  const filteredData = baseFilteredData;

  // 🔥 TOGGLE FILTER (multi-select)
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

  // 🔥 RESET ALL
  const resetFilters = () => setFilters(INITIAL_FILTERS);

  // 🔥 ACTIVE COUNT
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