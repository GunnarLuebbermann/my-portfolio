import { ExternalLink, Github } from 'lucide-react';

type Project = {
  title: string;
  description: string;
  link: string;
  tech: string[];
  status: 'completed' | 'in-progress' | 'planned';
  demo?: string; // optional Live-Demo
};

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description: "Ein modernes, responsives Portfolio mit Next.js, TypeScript und Tailwind CSS. Features umfassen Dark Mode, Animationen und eine optimierte Performance für alle Geräte.",
    link: "https://github.com/GunnarLuebbermann/my-portfolio",
    tech: ["Next.js", "TypeScript", "TailwindCSS"],
    status: "completed",
    demo: "https://www.gunnar-luebbermann.de",
  },
  {
    title: "Weather Dashboard",
    description: "Ein vollständiges Wetter-Dashboard mit 5-Tage-Vorhersage, Favoritenliste, interaktiven Charts und Dark Mode. Nutzt moderne React Patterns und State Management.",
    link: "https://github.com/GunnarLuebbermann/weather-dashboard",
    tech: ["Next.js", "TypeScript", "TailwindCSS", "TanStack Query"],
    status: "completed",
    demo: "https://weather-dashboard-seven-drab.vercel.app",
  },
  {
    title: "Net Sleeper",
    description: "Ein schlankes Go-Tool, das den PC automatisch herunterfährt, sobald Downloads abgeschlossen sind. Ideal für große Downloads über Nacht oder bei langsamen Verbindungen.",
    link: "https://github.com/GunnarLuebbermann/net-sleeper",
    tech: ["GoLang"],
    status: "in-progress",
  },
];

const statusColors = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  'in-progress': "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  planned: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
};

export default function ProjectsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Meine Projekte
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Eine Auswahl meiner Arbeiten und Experimente in der Webentwicklung
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
            <div
            key={project.title}
            className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-500 ease-out col-span-full sm:col-span-1"
            style={{ animationDelay: `${index * 100}ms` }}
            >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <span className={`px-3 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap ${statusColors[project.status]}`}>
                  {project.status === 'in-progress' ? 'In Arbeit' :
                    project.status === 'planned' ? 'Geplant' : 'Fertig'}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 rounded-lg border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-white bg-transparent hover:bg-blue-600 dark:hover:bg-blue-500 border-2 border-blue-600 dark:border-blue-400 rounded-lg transition-all duration-300 group/link"
                >
                  <Github size={16} className="group-hover/link:rotate-12 transition-transform duration-300" />
                  GitHub Repository
                  <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                </a>

                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-white bg-transparent hover:bg-green-600 dark:hover:bg-green-500 border-2 border-green-600 dark:border-green-400 rounded-lg transition-all duration-300 group/link"
                  >
                    Live Demo
                    <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
