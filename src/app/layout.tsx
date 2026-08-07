import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopLoader from "../components/layout/TopLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vodiy Kafel Savdo",
  description: "Farg'ona vodiysida yetakchi kafel va keramogranit savdosi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`h-full antialiased ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const clean = (el) => {
                  if (el && el.nodeType === 1) {
                    if (el.hasAttribute('bis_skin_checked')) el.removeAttribute('bis_skin_checked');
                    const items = el.querySelectorAll('[bis_skin_checked]');
                    for (let i = 0; i < items.length; i++) {
                      items[i].removeAttribute('bis_skin_checked');
                    }
                  }
                };
                const observer = new MutationObserver((mutations) => {
                  for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    if (m.addedNodes) {
                      for (let j = 0; j < m.addedNodes.length; j++) {
                        clean(m.addedNodes[j]);
                      }
                    }
                    if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                      m.target.removeAttribute('bis_skin_checked');
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TopLoader />
        {children}
      </body>
    </html>
  );
}
