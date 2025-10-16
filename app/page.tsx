"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import WavingHand from "./components/wavingHand";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <motion.section 
      className="flex flex-col items-center text-center py-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="relative mb-8"
      >
        <Image
          src="/gl.jpg"
          alt="Gunnar's profile picture"
          width={128}
          height={128}
          className="rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-lg"
          priority
        />
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-gray-600 bg-clip-text text-transparent py-2"
      >
        Hey, ich bin Gunnar <WavingHand />
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed"
      >
        Ich bin Webentwickler mit Fokus auf moderne Frontend-Technologien,
        sauberen Code und ansprechendes Design. Hier findest du meine Projekte
        und Möglichkeiten zur Kontaktaufnahme.
      </motion.p>
      
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/projects"
          className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
        >
          Zu meinen Projekten
        </Link>
        <Link
          href="/skills"
          className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
        >
          Zu meinen Skills
        </Link>
        <Link
          href="/contact"
          className="border-2 border-foreground px-6 py-3 rounded-lg font-medium hover:bg-foreground hover:text-background transition-all hover:scale-105"
        >
          Kontakt aufnehmen
        </Link>
      </motion.div>
    </motion.section>
  );
}