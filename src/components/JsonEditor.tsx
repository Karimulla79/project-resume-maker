"use client";

import { useState, useEffect, useRef } from "react";
import { ResumeData } from "@/types/resume";
import { sampleResume, emptyResume } from "@/data/sampleResume";
import { normalizeResume, isNativeFormat } from "@/utils/resumeNormalizer";
import { Clipboard, Check, RefreshCw, Trash2, Download, Upload, AlertCircle, Wand2, Star } from "lucide-react";

interface JsonEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onReview?: () => void;
}

export function JsonEditor({ data, onChange, onReview }: JsonEditorProps) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Synchronize when the external data state changes (e.g. from form editor edits)
  useEffect(() => {
    try {
      const currentParsed = JSON.parse(textRef.current);
      if (JSON.stringify(currentParsed) !== JSON.stringify(data)) {
        setText(JSON.stringify(data, null, 2));
        setError(null);
      }
    } catch {
      // If parsing fails, it means user was typing invalid JSON.
      // Force sync anyway if data matches default templates, otherwise don't disrupt typing.
      if (JSON.stringify(data) === JSON.stringify(sampleResume) || JSON.stringify(data) === JSON.stringify(emptyResume)) {
        setText(JSON.stringify(data, null, 2));
        setError(null);
      }
    }
  }, [data]);

  const handleTextChange = (value: string) => {
    setText(value);
    try {
      const parsed = JSON.parse(value);

      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Root value must be a JSON object");
      }

      // Auto-normalize any JSON format into ResumeData
      const normalized = normalizeResume(parsed);

      if (isNativeFormat(parsed)) {
        setDetectedFormat(null);
      } else {
        // Detect what kind of schema was used
        const schemaHint =
          parsed.work_experience ? "work_experience format" :
          parsed.workExperience ? "workExperience format" :
          parsed.jobs ? "jobs format" :
          parsed.name && !parsed.fullName ? "'name' field format" :
          "custom format";
        setDetectedFormat(schemaHint);
      }

      setError(null);
      onChange(normalized);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON: ", err);
    }
  };

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${data.fullName.toLowerCase().replace(/\s+/g, "_") || "resume"}_data.json`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export JSON: ", err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsed = JSON.parse(content);
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("File does not contain a valid JSON object");
        }
        // Show the raw imported JSON in the editor
        setText(JSON.stringify(parsed, null, 2));
        // Normalize and feed into resume state
        const normalized = normalizeResume(parsed);
        onChange(normalized);
        if (!isNativeFormat(parsed)) {
          setDetectedFormat("imported custom format — auto-mapped ✓");
        } else {
          setDetectedFormat(null);
        }
        setError(null);
      } catch (err: any) {
        alert(`Error importing JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadSample = () => {
    onChange(sampleResume);
    setText(JSON.stringify(sampleResume, null, 2));
    setError(null);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data? This will reset the editor.")) {
      onChange(emptyResume);
      setText(JSON.stringify(emptyResume, null, 2));
      setError(null);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setText(formatted);
      setError(null);
    } catch (err: any) {
      setError(`Cannot format: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[500px]">
      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
            title="Load template with sample candidate data"
          >
            <RefreshCw size={13} /> Load Sample
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            title="Clear all fields"
          >
            <Trash2 size={13} /> Clear Data
          </button>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handleFormat}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Prettify JSON alignment"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy JSON string"
          >
            {copied ? (
              <>
                <Check size={13} className="text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Clipboard size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Download JSON file"
          >
            <Download size={13} /> Export
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Upload a JSON resume file"
          >
            <Upload size={13} /> Import
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={onReview}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg transition-all shadow-sm"
            title="AI-powered resume review against AI Engineering pipeline criteria"
          >
            <Star size={13} /> Review
          </button>
        </div>
      </div>

      {/* Auto-map success banner */}
      {detectedFormat && !error && (
        <div className="flex items-center gap-2 p-2.5 mb-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
          <Wand2 size={13} className="shrink-0" />
          <div>
            <span className="font-semibold">Auto-mapped:</span> Detected <span className="italic">{detectedFormat}</span> → converted to resume format. Preview updated ✓
          </div>
        </div>
      )}

      {/* Editor Warning / Error Alert */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg animate-pulse">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">JSON Error:</span> {error}
          </div>
        </div>
      )}

      {/* Code Editor Container */}
      <div className="flex-1 relative border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-gray-950">
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-4 font-mono text-xs leading-relaxed text-gray-100 bg-transparent resize-none focus:outline-none focus:ring-0 overflow-y-auto"
          placeholder="Paste or edit candidate JSON details here..."
        />
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="text-[10px] text-gray-400">JSON schema verified on-the-fly</span>
        <span className="text-[10px] text-gray-400 font-mono">Lines: {text.split("\n").length}</span>
      </div>
    </div>
  );
}
