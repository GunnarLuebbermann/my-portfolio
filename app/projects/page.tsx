type Project = {
  title: string;
  description: string;
  link: string;
};

const projects: Project[] = [
  {
    title: "Portfolio Website",
    description: "Meine persönliche Seite mit Next.js und TailwindCSS.",
    link: "https://github.com/deinname/portfolio",
  },
  // {
  //   title: "React Dashboard",
  //   description: "Ein interaktives Dashboard mit Recharts und Zustand.",
  //   link: "https://github.com/deinname/dashboard",
  // },
  // {
  //   title: "API Integration Demo",
  //   description: "Ein Projekt, das eine externe API visuell darstellt.",
  //   link: "https://github.com/deinname/api-demo",
  // },
];

export default function ProjectsPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Projekte</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <a
            key={p.title}
            href={p.link}
            target="_blank"
            className="block border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{p.description}</p>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              → GitHub ansehen
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}