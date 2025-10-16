import { ExternalLink, Github } from 'lucide-react';

type Project = {
  title: string;
  description: string;
  link: string;
  tech: string[];
  status: 'completed' | 'in-progress' | 'planned';
};

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description: "Modern personal portfolio built with Next.js, TypeScript, and TailwindCSS featuring responsive design and dark mode.",
    link: "https://github.com/GunnarLuebbermann/my-portfolio",
    tech: ["Next.js", "TypeScript", "TailwindCSS"],
    status: "completed",
  },
  // {
  //   title: "React Dashboard",
  //   description: "Interactive analytics dashboard with real-time data visualization using Recharts and state management.",
  //   link: "",
  //   tech: ["React", "Recharts", "Zustand"],
  //   status: "in-progress",
  // },
  // {
  //   title: "API Integration Demo",
  //   description: "Full-stack application demonstrating REST API integration with data visualization and error handling.",
  //   link: "",
  //   tech: ["React", "Node.js", "REST API"],
  //   status: "planned",
  // },
];

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  'in-progress': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  planned: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
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
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                {project.status === 'in-progress' ? 'In Arbeit' : 
                 project.status === 'planned' ? 'Geplant' : 'Fertig'}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <Github size={16} />
              GitHub Repository
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}