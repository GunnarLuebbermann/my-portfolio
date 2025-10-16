"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center text-center py-16">
      <img
        src="/gl.jpg"
        alt="Profilbild"
        className="w-32 h-32 rounded-full mb-6 border-4 border-gray-200 dark:border-gray-700"
      />
      <h1 className="text-4xl font-bold mb-2">
        Hey, ich bin Gunnar{" "}
        <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-block">
          👋
        </motion.span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
        Ich bin Webentwickler mit Fokus auf moderne Frontend-Technologien,
        sauberen Code und ansprechendes Design. Hier findest du meine Projekte
        und Möglichkeiten zur Kontaktaufnahme.
      </p>
      <div className="flex gap-4">
        <a
          href="/projects"
          className="bg-foreground text-background px-5 py-2 rounded-lg font-medium hover:opacity-80 transition"
        >
          Zu meinen Projekten
        </a>
        <a
          href="/skills"
          className="bg-foreground text-background px-5 py-2 rounded-lg font-medium hover:opacity-80 transition"
        >
          Zu meinen Skills
        </a>
        <a
          href="/contact"
          className="border border-foreground px-5 py-2 rounded-lg font-medium hover:bg-foreground hover:text-background transition"
        >
          Kontakt aufnehmen
        </a>
      </div>
    </section>
  );
}