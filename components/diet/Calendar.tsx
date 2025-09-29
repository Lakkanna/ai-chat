"use client";

import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, isToday, getDaysInRange } from "../../lib/diet-data";

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarComponent({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14); // Show 14 days before today
  const endDate = new Date(today); // Only show up to today, no future dates

  const dates = getDaysInRange(startDate, endDate);

  // Auto-scroll to the end (today's date) when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }, 100);
    }
  }, []);

  // Scroll to today when selected date is today
  useEffect(() => {
    if (isToday(selectedDate) && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [selectedDate]);

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    // Only allow navigation if the new date is not in the future
    if (newDate <= today) {
      onDateChange(newDate);
    }
  };

  // Check if we can navigate to next week (not in the future)
  const canNavigateNext = () => {
    const nextWeekDate = new Date(selectedDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    return nextWeekDate <= today;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Calendar
        </h2>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNextWeek}
            disabled={!canNavigateNext()}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              canNavigateNext()
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="flex space-x-1.5 sm:space-x-2 min-w-max px-3 sm:px-0">
          {dates.map((date) => {
            const isSelected =
              selectedDate.toDateString() === date.toDateString();
            const isTodayDate = isToday(date);
            const isFutureDate = date > today;

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isFutureDate && onDateChange(date)}
                disabled={isFutureDate}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-lg min-w-[60px] sm:min-w-[80px] transition-all duration-200 ${
                  isFutureDate
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : isTodayDate
                    ? "bg-gray-700 text-white border-2 border-green-500"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-base sm:text-lg font-bold">
                  {date.getDate()}
                </span>
                <span className="text-xs">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
          Selected: {formatDate(selectedDate)}
        </p>
      </div>
    </div>
  );
}
