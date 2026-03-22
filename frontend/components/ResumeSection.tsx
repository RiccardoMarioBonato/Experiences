import { ChevronDown, ChevronRight, Briefcase, GraduationCap, Code, FolderOpen, User } from "lucide-react";
import { useState } from "react";

const getIcon = (type: string) => {
  switch (type) {
    case "experience": return <Briefcase size={20} className="text-indigo-400" />;
    case "education":  return <GraduationCap size={20} className="text-indigo-400" />;
    case "skills":     return <Code size={20} className="text-indigo-400" />;
    case "projects":   return <FolderOpen size={20} className="text-indigo-400" />;
    case "about":      return <User size={20} className="text-indigo-400" />;
    default:           return <Briefcase size={20} className="text-indigo-400" />;
  }
};

export default function ResumeSectionCard({ section, children }: { section: any, children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card hover:border-indigo-500/30 transition-colors">
      <div 
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mt-1 flex-shrink-0 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
          {getIcon(section.section_type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1">{section.title}</h3>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {section.subtitle && (
              <span className="font-medium text-indigo-300">{section.subtitle}</span>
            )}
            
            {(section.start_date || section.end_date) && (
              <>
                {section.subtitle && <span className="text-slate-600">•</span>}
                <span className="text-slate-400">
                  {section.start_date}{section.start_date && section.end_date && " — "}{section.end_date}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-slate-500 flex-shrink-0 ml-4">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-800 animate-in slide-in-from-top-2 fade-in duration-200">
          {section.description && (
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
              {section.description}
            </div>
          )}
          
          {children}
        </div>
      )}
    </div>
  );
}
