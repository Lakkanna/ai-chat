"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { DailyData, DailyTotals } from "../../lib/diet-data";

interface MacrosSectionProps {
  dailyData: DailyData | null;
  totals: DailyTotals | null;
}

export function MacrosSection({ dailyData, totals }: MacrosSectionProps) {
  if (!dailyData || !totals) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for this date</p>
      </div>
    );
  }

  const {
    totalCarbs,
    totalProtein,
    totalFat,
    carbsProgress,
    proteinProgress,
    fatProgress,
  } = totals;
  const { goals } = dailyData;

  const macroData = [
    {
      name: "Carbs",
      current: totalCarbs,
      target: goals.carbs,
      progress: carbsProgress,
      color: "bg-blue-500",
      unit: "g",
    },
    {
      name: "Protein",
      current: totalProtein,
      target: goals.protein,
      progress: proteinProgress,
      color: "bg-green-500",
      unit: "g",
    },
    {
      name: "Fat",
      current: totalFat,
      target: goals.fat,
      progress: fatProgress,
      color: "bg-yellow-500",
      unit: "g",
    },
  ];

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center">
        <BarChart3 className="mr-2" size={20} />
        Macros
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {macroData.map((macro) => (
          <div key={macro.name} className="bg-muted rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground font-medium">
                {macro.name}
              </span>
              <span className="text-foreground font-semibold">
                {macro.current} / {macro.target} {macro.unit}
              </span>
            </div>

            <div className="w-full bg-muted-foreground/20 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${macro.color}`}
                style={{ width: `${Math.min(macro.progress, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {macro.progress.toFixed(1)}% of goal
              </span>
              <span
                className={`font-semibold ${
                  macro.progress >= 100
                    ? "text-green-500"
                    : macro.progress >= 80
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {macro.progress >= 100
                  ? "Goal reached!"
                  : macro.progress >= 80
                  ? "Almost there!"
                  : "Keep going!"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Macro Summary */}
      <div className="mt-4 sm:mt-6 bg-muted rounded-lg p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2 sm:mb-3">
          Daily Summary
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-500">
              {totalCarbs}g
            </div>
            <div className="text-muted-foreground text-sm">Carbs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {totalProtein}g
            </div>
            <div className="text-muted-foreground text-sm">Protein</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">
              {totalFat}g
            </div>
            <div className="text-muted-foreground text-sm">Fat</div>
          </div>
        </div>
      </div>

      {/* Macro Tips */}
      <div className="mt-3 sm:mt-4 bg-muted rounded-lg p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium text-card-foreground mb-2">
          Tips
        </h3>
        <div className="text-muted-foreground text-sm space-y-1">
          {carbsProgress < 50 && (
            <p>
              • Consider adding more complex carbohydrates like oats, quinoa, or
              sweet potatoes
            </p>
          )}
          {proteinProgress < 70 && (
            <p>
              • Include lean proteins like chicken, fish, or legumes in your
              meals
            </p>
          )}
          {fatProgress < 60 && (
            <p>
              • Add healthy fats like avocado, nuts, or olive oil to your diet
            </p>
          )}
          {carbsProgress > 120 && (
            <p>
              • You&apos;re exceeding your carb goal - consider reducing refined
              carbs
            </p>
          )}
          {proteinProgress > 120 && (
            <p>• Great job on protein intake! Keep up the good work</p>
          )}
          {fatProgress > 120 && (
            <p>• Consider reducing saturated fats and focus on healthy fats</p>
          )}
        </div>
      </div>
    </div>
  );
}
