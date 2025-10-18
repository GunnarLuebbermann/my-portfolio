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

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <a
            href="mailto:gunnar-luebbermann@web.de"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">E-Mail</h3>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/gunnar-lübbermann-9689a4215/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <SiLinkedin className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">LinkedIn</h3>
            </div>
          </a>

          <a
            href="https://github.com/GunnarLuebbermann"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <SiGithub className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">GitHub</h3>
            </div>
          </a>
        </div>
    </section>
  );
}