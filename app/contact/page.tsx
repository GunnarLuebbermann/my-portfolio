import { Mail } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';

export default function ContactPage() {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kontakt</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Du möchtest mit mir zusammenarbeiten oder hast Fragen?
          Schreib mir einfach über eine der folgenden Plattformen:
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <a
          href="mailto:gunnar-luebbermann@web.de"
          className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors group"
        >
          <Mail className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
          <span className="font-medium">E-Mail</span>
        </a>
        <a
          href="https://www.linkedin.com/in/gunnar-lübbermann-9689a4215/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors group"
        >
          <SiLinkedin className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
          <span className="font-medium">LinkedIn</span>
        </a>
        <a
          href="https://github.com/GunnarLuebbermann"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors group"
        >
          <SiGithub className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
          <span className="font-medium">GitHub</span>
        </a>
      </div>
    </section>
  );
}