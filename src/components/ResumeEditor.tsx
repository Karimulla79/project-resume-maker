"use client";

import { ResumeData, Experience, Education } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

export function ResumeEditor({ data, onChange }: ResumeEditorProps) {
  const update = (partial: Partial<ResumeData>) => onChange({ ...data, ...partial });
  const updateContact = (key: keyof ResumeData["contact"], value: string) =>
    onChange({ ...data, contact: { ...data.contact, [key]: value } });

  const updateExperience = (id: string, partial: Partial<Experience>) => {
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, {
        id: Date.now().toString(), company: "", title: "", location: "",
        startDate: "", endDate: "", current: false, bullets: [""],
      }],
    });
  };

  const removeExperience = (id: string) => {
    if (data.experience.length <= 1) return;
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  const updateEducation = (id: string, partial: Partial<Education>) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, {
        id: Date.now().toString(), school: "", degree: "", field: "",
        startDate: "", endDate: "",
      }],
    });
  };

  const updateSkills = (skills: string[]) => onChange({ ...data, skills });

  return (
    <div className="space-y-4">
      <Section title="Personal Information">
        <Field label="Full Name" value={data.fullName} onChange={(v) => update({ fullName: v })} placeholder="John Doe" />
        <Field label="Professional Title" value={data.title} onChange={(v) => update({ title: v })} placeholder="Software Engineer" />
        <Field label="Summary" value={data.summary} onChange={(v) => update({ summary: v })} placeholder="Brief professional summary..." multiline />
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" value={data.contact.email} onChange={(v) => updateContact("email", v)} placeholder="email@example.com" />
          <Field label="Phone" value={data.contact.phone} onChange={(v) => updateContact("phone", v)} placeholder="(555) 123-4567" />
          <Field label="Location" value={data.contact.location} onChange={(v) => updateContact("location", v)} placeholder="City, State" />
          <Field label="LinkedIn" value={data.contact.linkedin ?? ""} onChange={(v) => updateContact("linkedin", v)} placeholder="linkedin.com/in/you" />
          <Field label="Website" value={data.contact.website ?? ""} onChange={(v) => updateContact("website", v)} placeholder="yourwebsite.com" />
          <Field label="GitHub" value={data.contact.github ?? ""} onChange={(v) => updateContact("github", v)} placeholder="github.com/you" />
        </div>
      </Section>

      <Section title="Experience">
        {data.experience.map((exp) => (
          <div key={exp.id} className="p-3 bg-gray-50 rounded-lg space-y-3 relative">
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
            <Field label="Job Title" value={exp.title} onChange={(v) => updateExperience(exp.id, { title: v })} />
            <Field label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
            <Field label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="2020" />
              <Field label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="Present" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                className="rounded"
              />
              Currently working here
            </label>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Achievements</label>
              {exp.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const bullets = [...exp.bullets];
                      bullets[i] = e.target.value;
                      updateExperience(exp.id, { bullets });
                    }}
                    placeholder="Describe an achievement..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => updateExperience(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateExperience(exp.id, { bullets: [...exp.bullets, ""] })}
                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add bullet
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 flex items-center justify-center gap-1">
          <Plus size={16} /> Add Experience
        </button>
      </Section>

      <Section title="Education">
        {data.education.map((edu) => (
          <div key={edu.id} className="p-3 bg-gray-50 rounded-lg space-y-3">
            <Field label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} placeholder="B.S." />
              <Field label="Field" value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} placeholder="Computer Science" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
              <Field label="End" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
            </div>
          </div>
        ))}
        <button type="button" onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 flex items-center justify-center gap-1">
          <Plus size={16} /> Add Education
        </button>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-1 rounded-lg text-sm">
              <input
                type="text"
                value={skill}
                onChange={(e) => {
                  const skills = [...data.skills];
                  skills[i] = e.target.value;
                  updateSkills(skills);
                }}
                placeholder="Skill"
                className="bg-transparent border-none outline-none w-24 text-sm"
              />
              <button type="button" onClick={() => updateSkills(data.skills.filter((_, j) => j !== i))} className="text-brand-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => updateSkills([...data.skills, ""])} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
          <Plus size={14} /> Add Skill
        </button>
      </Section>
    </div>
  );
}
