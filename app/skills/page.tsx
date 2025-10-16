"use client";
import { JSX, useState, useMemo } from "react";
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
  level: number;
  category: string;
  description: string;
  color: string;
};

const skills: Skill[] = [
  {
    name: "Golang",
    icon: <SiGo className="text-4xl" />,
    level: 4,
    category: "Backend",
    description: "Effiziente, performante Backend-Entwicklung mit Go-Routinen und REST-APIs.",
    color: "text-sky-500",
  },
  {
    name: "Python",
    icon: <SiPython className="text-4xl" />,
    level: 2,
    category: "Backend",
    description: "Datenverarbeitung, Scripting und Web-APIs mit FastAPI und Flask.",
    color: "text-yellow-400",
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-4xl" />,
    level: 4,
    category: "Frontend",
    description: "Server Components, App Router, SEO-optimierte Web-Apps.",
    color: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Angular",
    icon: <SiAngular className="text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Enterprise-fähige SPAs mit TypeScript und RxJS.",
    color: "text-red-600",
  },
  {
    name: "HTML",
    icon: <SiHtml5 className="text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Saubere, semantische Struktur für barrierefreies Webdesign.",
    color: "text-orange-500",
  },
  {
    name: "CSS",
    icon: <SiCss3 className="text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Responsive Layouts, TailwindCSS, moderne Design-Systeme.",
    color: "text-blue-500",
  },
  {
    name: "JavaScript",
    icon: <SiJavascript className="text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Kernsprache des Webs – DOM, ESNext, asynchrone Programmierung.",
    color: "text-yellow-400",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-4xl" />,
    level: 5,
    category: "Frontend",
    description: "Typsicherheit und robuste Codebases für skalierbare Projekte.",
    color: "text-blue-600",
  },
  {
    name: "Docker",
    icon: <SiDocker className="text-4xl" />,
    level: 4,
    category: "DevOps",
    description: "Containerisierung für reproduzierbare Deployments.",
    color: "text-blue-400",
  },
  {
    name: "Kubernetes",
    icon: <SiKubernetes className="text-4xl" />,
    level: 3,
    category: "DevOps",
    description: "Orchestrierung und Skalierung von Containern in Clustern.",
    color: "text-sky-600",
  },
  {
    name: "npm",
    icon: <SiNpm className="text-4xl" />,
    level: 4,
    category: "Tools",
    description: "Package-Management und Build-Automatisierung im Node-Ökosystem.",
    color: "text-red-500",
  },
];

const SkillCard = ({ skill, isExpanded, onToggle }: {
  skill: Skill;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div
    className="group p-6 border border-gray-200 dark:border-gray-700 rounded-xl text-center 
               hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 
               hover:-translate-y-2 transition-all duration-300 cursor-pointer
               bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
    onClick={onToggle}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    aria-expanded={isExpanded}
  >
    <div className="flex flex-col items-center gap-3 mb-4">
      <div className={`${skill.color} transition-transform group-hover:scale-110 duration-300`}>
        {skill.icon}
      </div>
      <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {skill.name}
      </h3>
      <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 
                       text-gray-600 dark:text-gray-300 rounded-full">
        {skill.category}
      </span>
    </div>

    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full 
                   transition-all duration-1000 ease-out"
        style={{ width: `${(skill.level / 5) * 100}%` }}
      />
    </div>

    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
      <span>Level {skill.level}/5</span>
      <span>{Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < skill.level ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}</span>
    </div>

    <div className={`overflow-hidden transition-all duration-300 ${
      isExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
    }`}>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {skill.description}
      </p>
    </div>

    <div className="text-xs text-gray-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      {isExpanded ? "Klick zum Schließen" : "Klick für Details"}
    </div>
  </div>
);

export default function SkillsPage() {
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map(skill => skill.category)));
    return ["All", ...cats];
  }, []);

  const filteredSkills = useMemo(() => {
    return selectedCategory === "All" 
      ? skills 
      : skills.filter(skill => skill.category === selectedCategory);
  }, [selectedCategory]);

  const toggleDetails = (skillName: string) => {
    setShowDetails(prev => prev === skillName ? null : skillName);
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
            Fähigkeiten & Technologien
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Entdecke meine technischen Kompetenzen und Erfahrungen in verschiedenen Bereichen
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              isExpanded={showDetails === skill.name}
              onToggle={() => toggleDetails(skill.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
