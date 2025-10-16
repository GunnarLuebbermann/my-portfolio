"use client";
import { JSX, useState } from "react";
import {
  SiGo,
  SiAngular,
  SiNextdotjs,
  SiDocker,
  SiKubernetes,
  SiNpm,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
} from "react-icons/si";

type Skill = {
  name: string;
  icon: JSX.Element;
  level: number; // 1–5
  category: string;
  description: string;
};

const skills: Skill[] = [
  {
    name: "Golang",
    icon: <SiGo className="text-sky-500 text-4xl" />,
    level: 4,
    category: "Backend",
    description: "Effiziente, performante Backend-Entwicklung mit Go-Routinen und REST-APIs.",
  },
  {
    name: "Python",
    icon: <SiPython className="text-yellow-400 text-4xl" />,
    level: 2,
    category: "Backend",
    description: "Datenverarbeitung, Scripting und Web-APIs mit FastAPI und Flask.",
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-gray-900 dark:text-gray-100 text-4xl" />,
    level: 4,
    category: "Frontend / Fullstack",
    description: "Server Components, App Router, SEO-optimierte Web-Apps.",
  },
  {
    name: "Angular",
    icon: <SiAngular className="text-red-600 text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Enterprise-fähige SPAs mit TypeScript und RxJS.",
  },
  {
    name: "HTML",
    icon: <SiHtml5 className="text-orange-500 text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Saubere, semantische Struktur für barrierefreies Webdesign.",
  },
  {
    name: "CSS",
    icon: <SiCss3 className="text-blue-500 text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Responsive Layouts, TailwindCSS, moderne Design-Systeme.",
  },
  {
    name: "JavaScript",
    icon: <SiJavascript className="text-yellow-400 text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Kernsprache des Webs – DOM, ESNext, asynchrone Programmierung.",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600 text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Typsicherheit und robuste Codebases für skalierbare Projekte.",
  },
  {
    name: "Docker",
    icon: <SiDocker className="text-blue-400 text-4xl" />,
    level: 4,
    category: "DevOps",
    description: "Containerisierung für reproduzierbare Deployments.",
  },
  {
    name: "Kubernetes",
    icon: <SiKubernetes className="text-sky-600 text-4xl" />,
    level: 3,
    category: "DevOps",
    description: "Orchestrierung und Skalierung von Containern in Clustern.",
  },
  {
    name: "npm",
    icon: <SiNpm className="text-red-500 text-4xl" />,
    level: 4,
    category: "Tools",
    description: "Package-Management und Build-Automatisierung im Node-Ökosystem.",
  },
];

export default function SkillsPage() {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Fähigkeiten & Technologien</h2>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl text-center hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
            onClick={() => setShowDetails(skill.name === showDetails ? null : skill.name)}
          >
            <div className="flex flex-col items-center gap-3 mb-4">
              {skill.icon}
              <h3 className="text-xl font-semibold">{skill.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</p>
            </div>

            {/* Skill-Level-Balken */}
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(skill.level / 5) * 100}%` }}
              ></div>
            </div>

            {/* Beschreibung (ein-/ausklappbar) */}
            {showDetails === skill.name && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                {skill.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <p>
          Klick auf eine Karte, um mehr über meine Erfahrung mit der jeweiligen Technologie zu erfahren.
        </p>
      </div>
    </section>
  );
}
