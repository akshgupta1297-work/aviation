import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "../lib/providers/StoreProvider";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aviora | Fly Smarter. Travel Better",
  description: "Aviora is a flight booking platform that helps you find the best deals on flights and book them in a few simple steps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <ToastContainer />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
