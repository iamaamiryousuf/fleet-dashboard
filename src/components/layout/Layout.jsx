import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Truck, BarChart3, TableProperties,
  RefreshCw, Menu, X, Moon, Sun
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

  // 🔥 FIX: stable dark mode init
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

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

      {/* SIDEBAR (DESKTOP) */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-slate-800 border-r
        ${sidebarOpen ? "w-60" : "w-16"}`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            {sidebarOpen && (
              <span className="font-bold text-sm">Fleet Dashboard</span>
            )}
          </div>

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                ${activeSection === id
                  ? "bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 dark:text-slate-300"}`}
            >
              <Icon className="w-4 h-4" />
              {sidebarOpen && label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="w-64 h-full bg-white dark:bg-slate-800 p-4">
            <button onClick={() => setMobileMenuOpen(false)}>
              <X />
            </button>

            <div className="mt-6 space-y-2">
              {NAV_ITEMS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    onSectionChange(id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left p-2"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-slate-800 border-b">

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden"
          >
            <Menu />
          </button>

          <h1 className="font-bold">Fleet Dashboard</h1>

          <div className="flex items-center gap-2">

            {/* DARK MODE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg"
            >
              {darkMode
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            {/* REFRESH */}
            <button onClick={onRefresh}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {isDemo && (
              <span className="text-xs px-2 py-1 bg-yellow-100 rounded">
                Demo
              </span>
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