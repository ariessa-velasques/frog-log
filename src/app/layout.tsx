import type { Metadata } from "next";
import { Inter, Gochi_Hand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const gochiHand = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gochi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrogLog Seu diário de metas",
  description: "Rastreie seus desafios e crie hábitos com um tabuleiro interativo inspirado em bullet journals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${gochiHand.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
