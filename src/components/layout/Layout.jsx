import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Truck, BarChart3, TableProperties,
  RefreshCw, ChevronLeft, Menu, X, Bell, Database,
  Moon, Sun
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "vehicles", label: "Vehicles", icon: Truck },
  { id: "data-table", label: "Data Table", icon: TableProperties },
];

export function Layout({
  children,
  lastUpdated,
  isDemo,
  onRefresh,
  loading,
  activeSection,
  onSectionChange
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      
      {/* SIDEBAR (same as before) */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 ${sidebarOpen ? "w-60" : "w-16"}`}>

        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-700">
          <Truck className="w-4 h-4 text-blue-600" />
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Fleet Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                activeSection === id
                  ? "bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 dark:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {sidebarOpen && label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
            <Menu />
          </button>

          <h1 className="font-bold text-slate-800 dark:text-white">
            Fleet Dashboard
          </h1>

          <div className="flex items-center gap-2">

            {/* 🌙 DARK MODE BUTTON (UPDATED) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* REFRESH */}
            <button onClick={onRefresh} className="p-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {isDemo && (
              <div className="text-xs px-2 py-1 bg-yellow-100 rounded">
                Demo
              </div>
            )}

          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}