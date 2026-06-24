import { ResumeData } from "@/types/resume";

export const sampleResume: ResumeData = {
  fullName: "Sarah Mitchell",
  title: "Senior Product Manager",
  summary:
    "Results-driven product leader with 8+ years of experience building user-centric digital products. Proven track record of launching products that drive revenue growth and improve customer satisfaction.",
  contact: {
    email: "sarah.mitchell@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahmitchell",
    website: "sarahmitchell.com",
  },
  experience: [
    {
      id: "1",
      company: "TechFlow Inc.",
      title: "Senior Product Manager",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led cross-functional team of 12 to launch mobile app, achieving 500K downloads in first 6 months",
        "Increased user retention by 35% through data-driven feature prioritization",
        "Managed $2M product budget and delivered roadmap on schedule",
      ],
    },
    {
      id: "2",
      company: "Innovate Labs",
      title: "Product Manager",
      location: "Austin, TX",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Defined product strategy for B2B SaaS platform serving 200+ enterprise clients",
        "Reduced customer churn by 22% through improved onboarding experience",
        "Collaborated with engineering to ship 15+ major features per quarter",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Stanford University",
      degree: "MBA",
      field: "Business Administration",
      startDate: "2016",
      endDate: "2018",
      gpa: "3.8",
    },
    {
      id: "2",
      school: "UC Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    "Product Strategy",
    "Agile/Scrum",
    "User Research",
    "Data Analysis",
    "Roadmapping",
    "SQL",
    "Figma",
    "Jira",
  ],
  certifications: ["Certified Scrum Product Owner", "Google Analytics"],
  languages: ["English", "Spanish"],
};

export const emptyResume: ResumeData = {
  fullName: "",
  title: "",
  summary: "",
  contact: {
    email: "",
    phone: "",
    location: "",
  },
  experience: [
    {
      id: "1",
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    },
  ],
  education: [
    {
      id: "1",
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    },
  ],
  skills: [""],
};
