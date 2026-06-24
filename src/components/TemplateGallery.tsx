"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { templates } from "@/data/templates";
import { TemplateMeta } from "@/types/resume";
import { TemplatePreviewCard } from "./TemplatePreviewCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { Search, Filter } from "lucide-react";

const categories = ["All", "Classic", "Modern", "Creative", "Professional", "Technical"] as const;

export function TemplateGallery() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "All" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleSelect = (template: TemplateMeta) => {
    router.push(`/editor/${template.id}`);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search templates by name, style, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={16} className="text-gray-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Showing {filtered.length} of {templates.length} templates
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((template) => (
          <TemplatePreviewCard
            key={template.id}
            template={template}
            onPreview={setPreviewTemplate}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No templates match your search.</p>
          <button
            onClick={() => { setSearch(""); setCategory("All"); }}
            className="mt-4 text-brand-600 hover:text-brand-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={(t) => { setPreviewTemplate(null); handleSelect(t); }}
      />
    </>
  );
}
