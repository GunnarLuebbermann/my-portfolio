export default function ContactPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Kontakt</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Du möchtest mit mir zusammenarbeiten oder hast Fragen?  
        Schreib mir einfach über eine der folgenden Plattformen:
      </p>
      <div className="flex justify-center gap-6 text-lg">
        <a
          href="mailto:gunnar-luebbermann@web.de"
          className="hover:underline"
        >
          📧 E-Mail
        </a>
        <a
          href="https://www.linkedin.com/in/gunnar-lübbermann-9689a4215/"
          target="_blank"
          className="hover:underline"
        >
          💼 LinkedIn
        </a>
        <a
          href="https://github.com/GunnarLuebbermann"
          target="_blank"
          className="hover:underline"
        >
          💻 GitHub
        </a>
      </div>
    </section>
  );
}