"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-white mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-white mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-100 mb-2 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-100 mb-2 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-100 mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-gray-100">{children}</li>,
          code: ({ children }) => (
            <code className="bg-gray-700 text-green-400 px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto mb-2">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-2">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 bg-gray-700 px-3 py-2 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-3 py-2 text-gray-100">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
