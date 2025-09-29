"use client";

import React, { useState } from "react";
import { Settings, RotateCcw, X, RefreshCw } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";

interface ChatConfigProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  onClose: () => void;
  onRefreshWithDietData?: () => void;
}

const DEFAULT_HEALTH_PROMPT = `You are a knowledgeable and supportive health and nutrition assistant. Your expertise includes:

• Nutrition and dietary guidance
• Exercise and fitness recommendations
• Weight management strategies
• Healthy lifestyle habits
• Meal planning and food choices
• Supplement information
• General health and wellness advice

Guidelines for your responses:
- Provide evidence-based, practical advice
- Always recommend consulting healthcare professionals for medical concerns
- Be encouraging and non-judgmental
- Focus on sustainable, realistic approaches
- Consider individual differences and preferences
- Emphasize balance and moderation
- Provide specific, actionable recommendations when possible

Remember: You're here to support healthy choices and provide educational information, not to replace professional medical advice.`;

export function ChatConfig({
  systemPrompt,
  onSystemPromptChange,
  onClose,
  onRefreshWithDietData,
}: ChatConfigProps) {
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSystemPromptChange(tempPrompt);
    setIsEditing(false);
  };

  const handleReset = () => {
    setTempPrompt(DEFAULT_HEALTH_PROMPT);
    onSystemPromptChange(DEFAULT_HEALTH_PROMPT);
    setIsEditing(false);
  };

  const handleRefreshWithDietData = () => {
    if (onRefreshWithDietData) {
      onRefreshWithDietData();
    }
  };

  const handleCancel = () => {
    setTempPrompt(systemPrompt);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="mr-3" size={28} />
            Chat Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Preference */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Theme Preference
            </h3>
            <ThemeToggle />
          </div>

          {/* System Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                System Prompt
              </h3>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    {onRefreshWithDietData && (
                      <button
                        onClick={handleRefreshWithDietData}
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center"
                        title="Refresh with current diet data"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        Refresh with Diet Data
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="text-green-400 hover:text-green-300 text-sm transition-colors flex items-center"
                    >
                      <RotateCcw size={16} className="mr-1" />
                      Reset to Default
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={12}
                placeholder="Enter your custom system prompt..."
              />
            ) : (
              <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {systemPrompt}
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">
              About System Prompts
            </h4>
            <p className="text-gray-300 text-sm">
              The system prompt defines how the AI assistant behaves and
              responds. The default prompt is optimized for health and nutrition
              guidance. You can customize it to focus on specific areas or
              change the assistant&apos;s personality.
            </p>
          </div>

          {/* Default Prompt Preview */}
          {systemPrompt !== DEFAULT_HEALTH_PROMPT && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">
                Default Health Prompt
              </h4>
              <p className="text-gray-300 text-sm">
                The default prompt focuses on health, nutrition, exercise, and
                wellness guidance. Click &quot;Reset to Default&quot; to restore
                it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
