"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  DailyData,
  getDailyData,
  saveDailyData,
  getDateString,
  formatDate,
  isToday,
  calculateDailyTotals,
  DEFAULT_GOALS,
} from "../../lib/diet-data";
import { parseUserEntry } from "../../lib/ai-tools";
import {
  CalendarComponent,
  CaloriesSection,
  MacrosSection,
  AddEntryDialog,
  DietLayout,
} from "../../components/diet";

export default function DietPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);

  const loadDailyData = useCallback(() => {
    const dateString = getDateString(selectedDate);
    const data = getDailyData(dateString);

    if (data) {
      setDailyData(data);
    } else {
      // Create new daily data with default goals
      const newData: DailyData = {
        date: dateString,
        goals: DEFAULT_GOALS,
        foodEntries: [],
        exerciseEntries: [],
      };
      setDailyData(newData);
      saveDailyData(newData);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadDailyData();
  }, [loadDailyData]);

  const handleAddEntry = async (userInput: string) => {
    try {
      const parsedEntry = await parseUserEntry(userInput);

      if (!dailyData) return;

      const updatedData = { ...dailyData };

      if (parsedEntry.type === "food") {
        const newFoodEntry = {
          id: Date.now().toString(),
          name: parsedEntry.name,
          calories: parsedEntry.calories || 0,
          carbs: parsedEntry.carbs || 0,
          protein: parsedEntry.protein || 0,
          fat: parsedEntry.fat || 0,
          quantity: parsedEntry.quantity || "1 serving",
          timestamp: new Date(),
        };
        updatedData.foodEntries.push(newFoodEntry);
      } else {
        const newExerciseEntry = {
          id: Date.now().toString(),
          name: parsedEntry.name,
          caloriesBurned: parsedEntry.caloriesBurned || 0,
          duration: parsedEntry.duration || 30,
          timestamp: new Date(),
        };
        updatedData.exerciseEntries.push(newExerciseEntry);
      }

      setDailyData(updatedData);
      saveDailyData(updatedData);
      setShowAddEntry(false);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const totals = dailyData ? calculateDailyTotals(dailyData) : null;

  return (
    <DietLayout currentPage="today">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Track My Diet
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {formatDate(selectedDate)} {isToday(selectedDate) && "(Today)"}
          </p>
        </div>
        <button
          onClick={() => setShowAddEntry(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <Plus size={18} className="mr-2" />
          <span className="hidden sm:inline">Add Entry</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-8">
        <CalendarComponent
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Calories Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-soft">
          <CaloriesSection dailyData={dailyData} totals={totals} />
        </div>

        {/* Macros Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-soft">
          <MacrosSection dailyData={dailyData} totals={totals} />
        </div>
      </div>

      {/* Add Entry Dialog */}
      {showAddEntry && (
        <AddEntryDialog
          onClose={() => setShowAddEntry(false)}
          onAdd={handleAddEntry}
        />
      )}
    </DietLayout>
  );
}
