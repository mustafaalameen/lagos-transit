import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
export const metadata: Metadata = {
  title: "Lagos Transit Safety Companion",
  description: "A Lagos public transport route and journey safety prototype.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
