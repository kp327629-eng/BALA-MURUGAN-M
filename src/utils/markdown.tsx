/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

function parseInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) return [text];
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-semibold text-slate-900 dark:text-slate-200">{part}</strong>;
    }
    return part;
  });
}

export function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  let listItems: React.ReactNode[] = [];
  const renderedElements: React.ReactNode[] = [];

  const flushList = (keyPrefix: number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc pl-5 space-y-1.5 my-3 text-slate-600 dark:text-slate-300">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      const bulletContent = trimmed.slice(1).trim();
      listItems.push(
        <li key={`li-${idx}`} className="leading-relaxed">
          {parseInlineBold(bulletContent)}
        </li>
      );
    } else {
      flushList(idx);

      if (trimmed.startsWith("###")) {
        renderedElements.push(
          <h3 key={idx} className="text-base font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2 flex items-center gap-1.5">
            {trimmed.slice(3).trim()}
          </h3>
        );
      } else if (trimmed.startsWith("####")) {
        renderedElements.push(
          <h4 key={idx} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-1.5">
            {trimmed.slice(4).trim()}
          </h4>
        );
      } else if (trimmed.startsWith("##")) {
        renderedElements.push(
          <h2 key={idx} className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1.5">
            {trimmed.slice(2).trim()}
          </h2>
        );
      } else if (trimmed.startsWith("#")) {
        renderedElements.push(
          <h1 key={idx} className="text-xl font-extrabold text-slate-900 dark:text-slate-50 mt-8 mb-4">
            {trimmed.slice(1).trim()}
          </h1>
        );
      } else if (trimmed === "") {
        renderedElements.push(<div key={idx} className="h-2"></div>);
      } else {
        renderedElements.push(
          <p key={idx} className="text-sm text-slate-600 dark:text-slate-300 my-2 leading-relaxed">
            {parseInlineBold(line)}
          </p>
        );
      }
    }
  });

  flushList(lines.length);

  return <div className="space-y-1 font-sans">{renderedElements}</div>;
}
