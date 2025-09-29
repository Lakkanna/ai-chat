"use client";

import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";

interface AddEntryDialogProps {
  onClose: () => void;
  onAdd: (input: string) => Promise<void>;
}

export function AddEntryDialog({ onClose, onAdd }: AddEntryDialogProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onAdd(input);
      setInput("");
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleEntries = [
    "Ate 1 bowl of oatmeal with berries for breakfast",
    "Had grilled chicken salad for lunch",
    "Ran for 30 minutes this morning",
    "Drank a protein shake after workout",
    "Walked for 45 minutes in the park",
    "Ate 2 slices of pizza for dinner",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="entry"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                What did you eat or what exercise did you do?
              </label>
              <textarea
                id="entry"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Ate 1 bowl of oatmeal with berries for breakfast"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Add Entry
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Examples:
            </h3>
            <div className="space-y-2">
              {exampleEntries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="block w-full text-left text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors"
                  disabled={isLoading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">
              How it works:
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Just describe what you ate or what exercise you did</li>
              <li>
                • Our AI will automatically categorize it as food or exercise
              </li>
              <li>
                • Nutritional information will be estimated and added to your
                daily totals
              </li>
              <li>• You can be as detailed or simple as you want</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
