import Link from "next/link";
import { TemplateGallery } from "@/components/TemplateGallery";
import { FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900">AI Resume</span>
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">14+ Professional Templates</span>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles size={16} />
            Choose the perfect template for your career
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Build a Professional Resume in Minutes
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto">
            Browse our collection of 14+ professionally designed resume templates.
            Preview each design with sample content, pick your favorite, and fill in your details.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TemplateGallery />
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          AI Resume Builder — Create professional resumes with ease
        </div>
      </footer>
    </div>
  );
}
