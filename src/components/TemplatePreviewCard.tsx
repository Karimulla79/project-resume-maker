"use client";

import { TemplateMeta } from "@/types/resume";
import { ResumeRenderer } from "./templates/ResumeRenderer";
import { sampleResume } from "@/data/sampleResume";
import { Star, Eye } from "lucide-react";

interface TemplatePreviewCardProps {
  template: TemplateMeta;
  onPreview: (template: TemplateMeta) => void;
  onSelect: (template: TemplateMeta) => void;
}

export function TemplatePreviewCard({ template, onPreview, onSelect }: TemplatePreviewCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-brand-300 hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onPreview(template)}>
        <div className="absolute inset-0 origin-top-left scale-[0.22] w-[455%] h-[455%] pointer-events-none">
          <ResumeRenderer templateId={template.id} data={sampleResume} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="bg-white/95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
            <Eye size={16} /> Preview Template
          </span>
        </div>
        {template.popular && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star size={12} fill="currentColor" /> Popular
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
          </div>
          <div
            className="w-4 h-4 rounded-full shrink-0 mt-1 ring-2 ring-white shadow"
            style={{ backgroundColor: template.accentColor }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{template.category}</span>
          {template.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onSelect(template)}
            className="flex-1 py-2 px-3 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
