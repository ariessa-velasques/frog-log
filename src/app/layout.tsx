import type { Metadata } from "next";
import { Inter, Gochi_Hand, Rubik_Doodle_Shadow } from "next/font/google";
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

const rubikDoodle = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-doodle",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrogLog Seu diário de metas",
  description: "Rastreie seus desafios e crie hábitos com um tabuleiro interativo inspirado em bullet journals.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${gochiHand.variable} ${rubikDoodle.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
