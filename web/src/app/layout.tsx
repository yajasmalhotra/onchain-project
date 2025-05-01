import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Providers } from '@/providers/WagmiProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EtherBets - Decentralized Betting Platform",
  description: "Create and enter bets on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-electric-purple to-cyber-blue`}>
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
