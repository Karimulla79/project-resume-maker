"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/data/templates";
import { emptyResume, sampleResume } from "@/data/sampleResume";
import { ResumeData } from "@/types/resume";
import { JsonEditor } from "@/components/JsonEditor";
import { ReviewPanel } from "@/components/ReviewModal";
import { ResumeRenderer } from "@/components/templates/ResumeRenderer";
import { ArrowLeft, Download, LayoutGrid, FileText } from "lucide-react";

const STORAGE_KEY = "ai-resume-data";

// Scale options: label shown to user → CSS zoom value applied at print time
const SCALE_OPTIONS = [
  { label: "2 pages",  value: "0.68" },
  { label: "3 pages",  value: "0.78" },
  { label: "4 pages",  value: "0.90" },
  { label: "5 pages",  value: "1.00" },
  { label: "6 pages",  value: "1.12" },
];

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const template = getTemplateById(templateId);

  const [data, setData] = useState<ResumeData>(sampleResume);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [printScale, setPrintScale] = useState("0.90"); // default: 4 pages

  // Review state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-${templateId}`);
    if (saved) {
      try { setData(JSON.parse(saved)); } catch { setData(sampleResume); }
    } else {
      setData(sampleResume);
    }
  }, [templateId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-${templateId}`, JSON.stringify(data));
  }, [data, templateId]);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template not found</h1>
          <Link href="/" className="text-brand-600 hover:text-brand-700">Back to templates</Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    // Save original title and temporarily set it to a blank space
    // This completely removes the name/title from the header of the printed PDF pages
    const originalTitle = document.title;
    document.title = " ";

    // Stamp the chosen scale on <html> so print CSS can read it
    document.documentElement.dataset.printScale = printScale;
    window.print();
    
    // Clean up after print dialog closes
    setTimeout(() => {
      delete document.documentElement.dataset.printScale;
      document.title = originalTitle;
    }, 2000);
  };

  const handleReview = async () => {
    setReviewOpen(true);
    setReviewLoading(true);
    setReviewResult(null);
    setReviewError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Review failed");
      setReviewResult(json.review);
    } catch (err: any) {
      setReviewError(err.message || "Unknown error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCloseReview = () => {
    setReviewOpen(false);
    setReviewResult(null);
    setReviewError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900">{template.name} Template</h1>
              <p className="text-xs text-gray-500">
                Auto-saved locally • <span className="text-brand-600 font-medium">Tip: Uncheck "Headers and footers" in print options to hide page numbers/dates</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LayoutGrid size={16} /> Change Template
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="sm:hidden px-3 py-2 text-sm font-medium bg-gray-100 rounded-lg"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>

            {/* Page Count Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <FileText size={14} className="text-gray-500 shrink-0" />
              <label className="text-xs text-gray-500 whitespace-nowrap">Target pages:</label>
              <select
                value={printScale}
                onChange={(e) => setPrintScale(e.target.value)}
                className="text-xs font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
              >
                {SCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1600px] mx-auto p-4 flex gap-6">
        {/* LEFT: JSON Schema Editor */}
        <div className={`no-print shrink-0 w-full lg:w-[680px] ${showPreview ? "hidden sm:block" : "block"}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20 flex flex-col gap-4 h-[calc(100vh-6rem)]">
            <div className="pb-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">JSON Schema Details</h2>
              <p className="text-xs text-gray-400 mt-0.5">Edit your resume data directly in JSON format</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <JsonEditor data={data} onChange={setData} onReview={handleReview} />
            </div>
          </div>
        </div>

        {/* RIGHT: Review Panel OR Live Preview */}
        <div className={`flex-1 min-w-0 ${!showPreview ? "hidden sm:block" : "block"}`}>
          {reviewOpen ? (
            <ReviewPanel
              loading={reviewLoading}
              review={reviewResult}
              error={reviewError}
              onClose={handleCloseReview}
            />
          ) : (
            <div className="flex justify-center">
              <div className="sticky top-20">
                <p className="no-print text-sm text-gray-500 text-center mb-3">Live Preview</p>
                <ResumeRenderer templateId={templateId} data={data} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print-only portal */}
      {mounted && createPortal(
        <div className="print-only">
          <ResumeRenderer templateId={templateId} data={data} />
        </div>,
        document.body
      )}
    </div>
  );
}
