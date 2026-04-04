import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Petty Lawsuits — Legal documents for Australian disputes",
  description: "Generate demand letters, complaint notices, and tribunal filings in minutes. No lawyer needed. From $29.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
