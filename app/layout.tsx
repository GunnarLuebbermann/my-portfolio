import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/navbar";

export const metadata = {
  title: "Mein Portfolio",
  description: "Portfolio von Gunnar – Webentwicklung & Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
              <Navbar />
          </header>

          <main className="mx-auto max-w-5xl p-6">{children}</main>

          <footer className="border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 py-6">
            © {new Date().getFullYear()} Gunnar – Alle Rechte vorbehalten.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
