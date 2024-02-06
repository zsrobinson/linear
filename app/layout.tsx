import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "~/components/navbar";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Concepts in Linear Algebra",
  description:
    "A collection of concepts from linear algebra, with interactive demonstrations.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
