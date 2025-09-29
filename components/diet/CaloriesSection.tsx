"use client";

import React from "react";
import {
  Utensils,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DailyData, DailyTotals } from "../../lib/diet-data";

interface CaloriesSectionProps {
  dailyData: DailyData | null;
  totals: DailyTotals | null;
}

export function CaloriesSection({ dailyData, totals }: CaloriesSectionProps) {
  if (!dailyData || !totals) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for this date</p>
      </div>
    );
  }

  const { foodCalories, exerciseCalories, netCalories, remainingCalories } =
    totals;
  const goalCalories = dailyData.goals.calories;
  const progressPercentage = Math.min((netCalories / goalCalories) * 100, 100);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center">
        <Target className="mr-2" size={20} />
        Calories
      </h2>

      {/* Main Calorie Display */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-muted rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Daily Goal</span>
            <span className="text-foreground font-semibold">
              {goalCalories} cal
            </span>
          </div>
          <div className="w-full bg-muted-foreground/20 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage >= 100 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {netCalories} / {goalCalories} cal
            </span>
            <span
              className={`font-semibold ${
                remainingCalories > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {remainingCalories > 0 ? (
                <span className="flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  {remainingCalories} left
                </span>
              ) : (
                <span className="flex items-center">
                  <TrendingDown size={16} className="mr-1" />
                  {Math.abs(remainingCalories)} over
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Food Intake */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2 sm:mb-3 flex items-center">
          <Utensils className="mr-2" size={18} />
          Food Intake
        </h3>
        <div className="bg-muted rounded-lg p-3 sm:p-4">
          <div className="text-2xl font-bold text-foreground mb-1">
            {foodCalories} cal
          </div>
          <div className="text-muted-foreground text-sm">
            {dailyData.foodEntries.length} entries
          </div>
        </div>

        {/* Food Entries List */}
        {dailyData.foodEntries.length > 0 && (
          <div className="mt-2 sm:mt-3 space-y-2">
            {dailyData.foodEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-muted rounded-lg p-2.5 sm:p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-foreground font-medium">
                    {entry.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {entry.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-semibold">
                    {entry.calories} cal
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {entry.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise */}
      <div>
        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2 sm:mb-3 flex items-center">
          <Activity className="mr-2" size={18} />
          Exercise
        </h3>
        <div className="bg-muted rounded-lg p-3 sm:p-4">
          <div className="text-2xl font-bold text-foreground mb-1">
            {exerciseCalories} cal
          </div>
          <div className="text-muted-foreground text-sm">
            {dailyData.exerciseEntries.length} activities
          </div>
        </div>

        {/* Exercise Entries List */}
        {dailyData.exerciseEntries.length > 0 && (
          <div className="mt-2 sm:mt-3 space-y-2">
            {dailyData.exerciseEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-muted rounded-lg p-2.5 sm:p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-foreground font-medium">
                    {entry.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {entry.duration} minutes
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-semibold">
                    -{entry.caloriesBurned} cal
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {entry.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
