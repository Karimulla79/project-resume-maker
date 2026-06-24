import { ComponentType } from "react";
import { ResumeData } from "@/types/resume";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { TechnicalTemplate } from "./TechnicalTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { CompactTemplate } from "./CompactTemplate";
import { SidebarTemplate } from "./SidebarTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { AcademicTemplate } from "./AcademicTemplate";
import { StartupTemplate } from "./StartupTemplate";
import { TimelineTemplate } from "./TimelineTemplate";

const templateMap: Record<string, ComponentType<{ data: ResumeData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
  elegant: ElegantTemplate,
  compact: CompactTemplate,
  sidebar: SidebarTemplate,
  bold: BoldTemplate,
  academic: AcademicTemplate,
  startup: StartupTemplate,
  timeline: TimelineTemplate,
};

interface ResumeRendererProps {
  templateId: string;
  data: ResumeData;
  className?: string;
}

export function ResumeRenderer({ templateId, data, className = "" }: ResumeRendererProps) {
  const Template = templateMap[templateId] ?? ClassicTemplate;
  return (
    <div className={`resume-page shadow-lg relative bg-white ${className}`}>
      <Template data={data} />
    </div>
  );
}

export { templateMap };
