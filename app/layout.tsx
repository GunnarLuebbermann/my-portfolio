import "./globals.css";
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
    <html lang="de">
      <body className="bg-background text-foreground font-sans antialiased">
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-6">
            <Navbar />
          </div>
        </header>


        <main className="mx-auto max-w-5xl p-6">{children}</main>

        <footer className="border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 py-6">
          © {new Date().getFullYear()} Gunnar – Alle Rechte vorbehalten.
        </footer>
      </body>
    </html>
  );
}
