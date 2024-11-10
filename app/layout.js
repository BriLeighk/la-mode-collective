import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const bodoniModa = localFont({
  src: "./fonts/BodoniModa-VariableFont_opsz,wght.ttf",
  variable: "--bodoni-moda",
  weight: "100 900",
});
const quintessential = localFont({
  src: "./fonts/Quintessential-Regular.ttf",
  variable: "--quintessential",
  weight: "100 900",
});

export const metadata = {
  title: "La Mode Collective",
  description: "A closet collective of your wardrobe, styled for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable} ${quintessential.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
