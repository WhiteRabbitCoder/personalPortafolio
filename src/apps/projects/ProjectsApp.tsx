import { useState } from 'react';
import { ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '@/data/projects';
import { AppIcon } from '@/components/window/AppIcon';
import type { Project } from '@/types';

export function ProjectsApp() {
  const [selected, setSelected] = useState<Project | null>(null);

  const handleOpen = (project: Project) => {
    window.open(project.homepage || project.url, '_blank', 'noopener');
  };

  return (
    <div className="flex h-full flex-col bg-[rgba(12,8,24,0.6)]">
      {/* Toolbar */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/5 px-3">
        <div className="flex flex-1 items-center gap-2 rounded-md bg-white/5 px-2 py-1">
          <span className="text-[11px] text-white/40">📂</span>
          <span className="text-[11px] text-white/60">C:\Users\Angelo\Projects</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* File list */}
        <div className="flex w-full flex-col overflow-auto md:w-1/2 md:border-r md:border-white/5">
          {projects.map((project) => (
            <button
              key={project.id}
              className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                selected?.id === project.id
                  ? 'bg-[var(--color-accent-soft)]'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setSelected(project)}
              onDoubleClick={() => handleOpen(project)}
            >
              <AppIcon icon={project.icon} size={20} className="shrink-0 text-violet-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white/90">{project.name}</p>
                <p className="truncate text-[11px] text-white/40">
                  {project.stack.join(' · ')}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="hidden flex-1 overflow-auto p-4 md:block">
          {selected ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
                  <AppIcon icon={selected.icon} size={24} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/90">
                    {selected.name}
                  </h2>
                  <p className="text-xs text-white/40">
                    {selected.stack.join(' · ')}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-white/70">
                {selected.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {selected.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[11px] text-violet-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <GitBranch size={12} />
                  Source Code
                </a>
                {selected.homepage && (
                  <a
                    href={selected.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs text-violet-300 transition-colors hover:bg-violet-500/25"
                  >
                    <ExternalLink size={12} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/30">Select a project to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center border-t border-white/5 px-3">
        <span className="text-[10px] text-white/30">{projects.length} items</span>
      </div>
    </div>
  );
}
