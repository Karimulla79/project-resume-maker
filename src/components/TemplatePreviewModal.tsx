"use client";

import { TemplateMeta } from "@/types/resume";
import { ResumeRenderer } from "./templates/ResumeRenderer";
import { sampleResume } from "@/data/sampleResume";
import { X } from "lucide-react";

interface TemplatePreviewModalProps {
  template: TemplateMeta | null;
  onClose: () => void;
  onSelect: (template: TemplateMeta) => void;
}

export function TemplatePreviewModal({ template, onClose, onSelect }: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-100 flex justify-center">
          <div className="w-[210mm] shrink-0">
            <ResumeRenderer templateId={template.id} data={sampleResume} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onSelect(template)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}
