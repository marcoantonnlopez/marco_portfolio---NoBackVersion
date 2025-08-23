import type { Metadata } from "next";
import "./globals.css";
import {Header} from "../components/organisms/Header"
import SiteFooter from "@/components/organisms/SiteFooter";
import { Poppins, Geist, Geist_Mono } from "next/font/google";

// 🚀 Llamamos al loader en módulo scope
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],        // ajusta los pesos que vayas a usar
  variable: "--font-poppins",    // si quieres exponerla como variable CSS
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "MarcoLopez.com",
  description: "Marco Lopez Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Aplica las variables en el html para poder usarlas en CSS
      className={`${poppins.variable} ${geistSans.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <Header />
        <main className=" mx-auto">{children}</main>
        <SiteFooter
        title="Let’s build something people want."
        tagline="Founder energy meets product sense. Ready when you are."
      />
      </body>
    </html>
  );
}
