import type { Metadata } from "next";
import "./globals.css";
import WebMCPTools from "./components/WebMCPTools";
import WebMCPLanguageTools from "./components/WebMCPLanguageTools";
import WebMCPProfileTools from "./components/WebMCPProfileTools";

export const metadata: Metadata = {
  title: "Forsyningsdata Danmark — WebMCP Challenge 2026",
  description: "Scoped public WebMCP challenge demo for Danish address, property and infrastructure data."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da">
      <body>
        <WebMCPTools />
        <WebMCPLanguageTools />
        <WebMCPProfileTools />
        {children}
      </body>
    </html>
  );
}
