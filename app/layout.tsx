import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Lagos Transit Safety Companion",
  description: "A Lagos public transport route and journey safety prototype.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
