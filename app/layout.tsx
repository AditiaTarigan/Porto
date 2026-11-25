import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditia — Developer Portfolio",
  description: "An interactive developer portfolio built around a 3D keyboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
