import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import "../styles/globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-accent",
  display: "swap",
  preload: false, // defer this large CJK font
});

export const metadata: Metadata = {
  metadataBase: new URL("https://antigravity.vercel.app"),
  title: "Antigravity — Between Rain and Wonder",
  description:
    "An immersive 3D web experience blending cinematic storytelling, real-time WebGL, and procedural audio. Step into the stillness of an ancient forest.",
  keywords: [
    "Antigravity",
    "immersive web",
    "3D experience",
    "WebGL",
    "forest",
    "cinematic",
    "React Three Fiber",
  ],
  authors: [{ name: "Antigravity Studio" }],
  openGraph: {
    title: "Antigravity — Between Rain and Wonder",
    description:
      "An immersive 3D web experience. Step into the stillness of an ancient forest.",
    url: "https://antigravity.vercel.app",
    siteName: "Antigravity",
    images: [
      {
        url: "/frames/ezgif-frame-001.jpg",
        width: 1200,
        height: 630,
        alt: "Antigravity — Between Rain and Wonder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antigravity — Between Rain and Wonder",
    description: "An immersive 3D web experience. Step into the stillness.",
    images: ["/frames/ezgif-frame-001.jpg"],
    creator: "@antigravity",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://antigravity.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Antigravity",
  url: "https://antigravity.vercel.app",
  description:
    "An immersive 3D web experience blending cinematic storytelling, real-time WebGL, and procedural audio.",
  author: {
    "@type": "Organization",
    name: "Antigravity Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${notoSerifJp.variable} scroll-smooth`}
    >
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Prefetch critical frame */}
        <link
          rel="prefetch"
          href="/frames/ezgif-frame-001.jpg"
          as="image"
        />
      </head>
      <body className="antialiased bg-[#0a0a0a] text-[#e8e0d4]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
