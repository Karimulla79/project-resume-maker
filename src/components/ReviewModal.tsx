"use client";

import { XCircle, LayoutTemplate, Star } from "lucide-react";

interface ReviewPanelProps {
  loading: boolean;
  review: string | null;
  error: string | null;
  onClose: () => void;
}

/** Lightweight markdown → HTML renderer for AI review output */
function renderMarkdown(md: string): string {
  return (
    md
      // Status badges first (before general / replacements)
      .replace(
        / Ready for AI Engineer role/g,
        "<span class='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-sm font-semibold'>✅ Ready for AI Engineer role</span>"
      )
      .replace(
        / Needs stronger pipeline depth/g,
        "<span class='inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm font-semibold'>⚠️ Needs stronger pipeline depth</span>"
      )
      .replace(
        / Not suitable/g,
        "<span class='inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-800 rounded-full text-sm font-semibold'>❌ Not suitable</span>"
      )
      // Pass / Fail
      .replace(/ Pass/g, "<span class='text-emerald-700 font-semibold'> Pass</span>")
      .replace(/ Fail/g, "<span class='text-red-600 font-semibold'> Fail</span>")
      // Emoji status dots
      .replace(/🟢/g, "<span>🟢</span>")
      .replace(/🟡/g, "<span>🟡</span>")
      .replace(/🔴/g, "<span>🔴</span>")
      // Headings
      .replace(
        /^## (.+)$/gm,
        "<h2 class='text-base font-bold text-gray-900 mt-6 mb-2 pb-1.5 border-b border-gray-200 flex items-center gap-2'>$1</h2>"
      )
      .replace(
        /^### (.+)$/gm,
        "<h3 class='text-sm font-bold text-gray-800 mt-4 mb-1'>$1</h3>"
      )
      .replace(
        /^#### (.+)$/gm,
        "<h4 class='text-xs font-bold text-gray-700 mt-3 mb-1 uppercase tracking-wide'>$1</h4>"
      )
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-gray-900'>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em class='italic text-gray-700'>$1</em>")
      // Inline code
      .replace(
        /`([^`]+)`/g,
        "<code class='px-1 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-800'>$1</code>"
      )
      // Checklist items — checked
      .replace(
        /^- \[x\] (.+)$/gm,
        "<li class='flex items-center gap-2 text-sm py-0.5'><span class='shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold'>✓</span><span class='text-emerald-800'>$1</span></li>"
      )
      // Checklist items — unchecked
      .replace(
        /^- \[ \] (.+)$/gm,
        "<li class='flex items-center gap-2 text-sm py-0.5'><span class='shrink-0 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold'>✗</span><span class='text-red-700'>$1</span></li>"
      )
      // Regular bullet points
      .replace(
        /^[-•] (.+)$/gm,
        "<li class='text-sm text-gray-700 leading-relaxed list-disc ml-4'>$1</li>"
      )
      // Wrap consecutive <li> in <ul>
      .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class='space-y-0.5 my-2'>${match}</ul>`)
      // Tables — separator rows (e.g. |---|---|)
      .replace(/^\|[-| :]+\|$/gm, "")
      // Table rows
      .replace(/^\|(.+)\|$/gm, (match, inner) => {
        const cells = inner.split("|").map((c: string) => c.trim());
        const isLikelyHeader = cells.some(
          (c: string) => c === "Phase" || c === "Step" || c === "Phase" || c === "Status" || c === "Company"
        );
        const tag = isLikelyHeader ? "th" : "td";
        const tdClass = isLikelyHeader
          ? "px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide bg-gray-50 border-b border-gray-200"
          : "px-3 py-2 text-sm text-gray-700 border-b border-gray-100";
        return (
          "<tr>" +
          cells.map((c: string) => `<${tag} class='${tdClass}'>${c}</${tag}>`).join("") +
          "</tr>"
        );
      })
      // Wrap consecutive <tr> in <table>
      .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (match) =>
        `<div class='overflow-x-auto my-3 rounded-lg border border-gray-200'><table class='w-full border-collapse'>${match}</table></div>`
      )
      // Horizontal rules
      .replace(/^---+$/gm, "<hr class='border-gray-200 my-3' />")
      // Paragraphs: plain lines not already wrapped in an html tag
      .replace(/^(?!<[a-z/]).+$/gm, (line) =>
        line.trim() ? `<p class='text-sm text-gray-700 leading-relaxed my-1'>${line}</p>` : ""
      )
  );
}

export function ReviewPanel({ loading, review, error, onClose }: ReviewPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden h-[calc(100vh-6rem)] sticky top-20">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Star size={14} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">AI Resume Review</h2>
            <p className="text-violet-200 text-[11px]">Pipeline Evaluation Report</p>
          </div>
        </div>
        <button
          onClick={onClose}
          title="Close review — show Live Preview"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          <LayoutTemplate size={13} />
          Show Preview
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Star size={16} className="text-violet-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">Analyzing resume…</p>
              <p className="text-xs text-gray-500 mt-1">Running strict pipeline evaluation</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center max-w-xs">
              {["Career Phases", "MLOps Depth", "RAG Pipeline", "Agentic AI", "Scoring"].map((step) => (
                <span
                  key={step}
                  className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs rounded-full animate-pulse"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <XCircle size={36} className="text-red-400" />
            <p className="font-semibold text-gray-800 text-sm">Review Failed</p>
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl max-w-xs text-center">
              {error}
            </p>
            <p className="text-[11px] text-gray-400 text-center max-w-xs">
              Make sure <code className="bg-gray-100 px-1 rounded">GEMINI_API_KEY</code> is set in your{" "}
              <code className="bg-gray-100 px-1 rounded">.env.local</code> and restart the dev server.
            </p>
          </div>
        )}

        {/* Review Result */}
        {review && !loading && (
          <div
            className="prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(review) }}
          />
        )}
      </div>
    </div>
  );
}
