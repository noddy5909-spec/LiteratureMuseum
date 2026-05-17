import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "남녕 문학관 | Literature Museum",
  description: "고등학교 문학 수업을 위한 협력 감상·주제 의식 공유 MVP",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${notoSerifKr.variable} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
