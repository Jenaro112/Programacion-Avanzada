import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Outfit es geométrica, suave, ultra-moderna y nada "tech"
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panel de Sincronización",
  description: "Interfaz premium para flujos de activación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable}`}>
      <body className="font-sans antialiased selection:bg-accent-primary selection:text-white">
        <div className="fixed inset-0 z-[-1] h-full w-full bg-background" />
        {children}
      </body>
    </html>
  );
}
