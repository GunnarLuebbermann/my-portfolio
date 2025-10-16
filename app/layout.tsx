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
        <header className="border-b border-gray-200 dark:border-gray-800">
          <Navbar />
        </header>

        <main className="mx-auto max-w-5xl p-6">{children}</main>

        <footer className="border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 py-6">
          © {new Date().getFullYear()} Gunnar – Alle Rechte vorbehalten.
        </footer>
      </body>
    </html>
  );
}
