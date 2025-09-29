"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Target,
  Calendar,
  BarChart3,
  Weight,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface DietNavigationProps {
  currentPage?: string;
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export function DietNavigation({
  currentPage,
  sidebarOpen = false,
  toggleSidebar,
}: DietNavigationProps) {
  const navigationItems = [
    {
      href: "/diet",
      label: "Today",
      icon: Calendar,
      isActive: currentPage === "today",
    },
    {
      href: "/diet/goals",
      label: "Daily Goals",
      icon: Target,
      isActive: currentPage === "goals",
    },
    {
      href: "/diet/weekly",
      label: "Weekly Summary",
      icon: BarChart3,
      isActive: currentPage === "weekly",
    },
    {
      href: "/diet/monthly",
      label: "Monthly Summary",
      icon: BarChart3,
      isActive: currentPage === "monthly",
    },
    {
      href: "/diet/weight",
      label: "Weight Tracker",
      icon: Weight,
      isActive: currentPage === "weight",
    },
  ];

  return (
    <>
      {/* Sidebar Navigation */}
      <div
        className={`w-[250px] bg-gray-800 fixed top-0 left-0 h-full z-20 border-r border-gray-700 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:text-gray-300 transition-colors p-1"
          >
            <ArrowLeft size={20} className="rotate-90" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      item.isActive
                        ? "text-white bg-gray-700"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && toggleSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export function DietLayout({
  children,
  currentPage,
}: {
  children: React.ReactNode;
  currentPage?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full flex">
      <DietNavigation
        currentPage={currentPage}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 w-full transition-all duration-300 lg:ml-[250px] bg-gray-900">
        <div className="p-4 lg:p-6 w-full">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white p-2 mb-4 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
