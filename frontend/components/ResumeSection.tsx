import Link from "next/link";
import { ChevronDown, ChevronRight, Briefcase, GraduationCap, Code, FolderOpen, User, Play } from "lucide-react";
import { useState } from "react";

const getIcon = (type: string) => {
  const cls = "text-[#E040FB]";
  switch (type) {
    case "experience": return <Briefcase size={20} className={cls} />;
    case "education":  return <GraduationCap size={20} className={cls} />;
    case "skills":     return <Code size={20} className={cls} />;
    case "projects":   return <FolderOpen size={20} className={cls} />;
    case "about":      return <User size={20} className={cls} />;
    default:           return <Briefcase size={20} className={cls} />;
  }
};

export default function ResumeSectionCard({
  section,
  children,
  index = 0,
  videoLink,
}: {
  section: any;
  children?: React.ReactNode;
  index?: number;
  videoLink?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="card group relative overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Left border accent on hover */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-xl"
        style={{ background: "linear-gradient(to bottom, #E040FB, #F50057)" }}
      />

      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="mt-1 flex-shrink-0 p-2.5 rounded-xl"
          style={{
            background: "rgba(224, 64, 251, 0.1)",
            border: "1px solid rgba(224, 64, 251, 0.2)",
          }}
        >
          {getIcon(section.section_type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-white">{section.title}</h3>
            {videoLink && (
              <Link
                href={videoLink}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(245, 0, 87, 0.12)",
                  border: "1px solid rgba(245, 0, 87, 0.35)",
                  color: "#F50057",
                }}
              >
                <Play size={10} fill="#F50057" /> Video
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {section.subtitle && (
              <span className="font-medium text-[#E040FB]">{section.subtitle}</span>
            )}

            {(section.start_date || section.end_date) && (
              <>
                {section.subtitle && (
                  <span style={{ color: "rgba(160, 160, 184, 0.4)" }}>•</span>
                )}
                <span className="text-[#A0A0B8]">
                  {section.start_date}
                  {section.start_date && section.end_date && " — "}
                  {section.end_date}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="text-[#A0A0B8] flex-shrink-0 ml-4 group-hover:text-[#E040FB] transition-colors duration-200">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {isOpen && (
        <div
          className="mt-6 pt-6 animate-in slide-in-from-top-2 fade-in duration-200"
          style={{ borderTop: "1px solid rgba(224, 64, 251, 0.15)" }}
        >
          {section.description && (
            <div className="prose prose-invert max-w-none text-[#A0A0B8] text-sm leading-relaxed whitespace-pre-wrap mb-6">
              {section.description}
            </div>
          )}

          {children}
        </div>
      )}
    </div>
  );
}
