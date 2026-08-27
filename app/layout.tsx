import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./ranking.css";
import "./current-archive.css";
import "./team-directory.css";
import "./deep-archive.css";
import "./yearly-archive.css";
import "./current-careers.css";
import "./navigation-fixes.css";
import "./readability.css";
import "./driver-directory.css";
import "./section-jump.css";
import "./archive-tables.css";
import "./integrated-lineage.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const [repositoryOwner = "", repositoryName = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const pagesBasePath = process.env.GITHUB_ACTIONS === "true" && repositoryName && !repositoryName.endsWith(".github.io") ? `/${repositoryName}` : "";
const socialImage = process.env.GITHUB_ACTIONS === "true" && repositoryOwner
  ? `https://${repositoryOwner}.github.io${pagesBasePath}/og.png`
  : "/og.png";

export const metadata: Metadata = {
  title: "Paddock Index — F1データベース",
  description: "1950年から現在まで。F1のチーム、ドライバー、マシンの系譜を探索できるデータベース。",
  openGraph: {
    title: "Paddock Index",
    description: "F1の現在と歴史を確認できるデータベース。",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Paddock Index" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paddock Index",
    description: "F1の現在と歴史を確認できるデータベース。",
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
