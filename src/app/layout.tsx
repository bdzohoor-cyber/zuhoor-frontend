import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Playfair_Display, Raleway } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import { ToastContainer } from "@/components/ui/toast-context"
import { MetaPixel } from "@/components/MetaPixel"

import "../styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair-display",
  // Only load weights you actually use (check your CSS/Tailwind config)
  weight: ["400", "500", "600", "700"], // Remove unused weights
})

const raleway = Raleway({
  subsets: ["latin"],
  style: ["normal"], // Remove "italic" if not used
  display: "swap",
  variable: "--font-raleway",
  // Only load weights you actually use
  weight: ["300", "400", "500", "600", "700"], // Remove unused weights
})

export default function RootLayout(props: { children: React.ReactNode }) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  return (
    <html lang="en" data-mode="light" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {pixelId && (
          <>
            <link rel="preconnect" href="https://connect.facebook.net" />
            <link rel="dns-prefetch" href="https://connect.facebook.net" />
          </>
        )}
      </head>
      <body className={`${raleway.variable} ${playfairDisplay.variable} font-sans`}>
        <ToastContainer>
          <main className="relative">{props.children}</main>
        </ToastContainer>
        <SpeedInsights />
        {pixelId && <MetaPixel pixelId={pixelId} />}
      </body>
    </html>
  )
}
