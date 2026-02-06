import React from "react"
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'
import Dither from "@/components/Dither";
import FooterSection from "@/components/footer";
import {HeroHeader} from "@/components/header";

const _geist = Geist({subsets: ["latin"]});
const _geistMono = Geist_Mono({subsets: ["latin"]});

export const metadata: Metadata = {
    title: 'v0 Prompt to Production - Lima | Saturday February 7th, 2026',
    description: 'Local build session hosted by Crafter Station as part of v0 Prompt to Production Week. Ship real apps and agents using the latest v0 updates.',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
        <body className="font-sans antialiased">
        <div className='absolute w-full h-dvh max-h-155 sm:max-h-115 md:max-h-125 lg:max-h-190 xl:max-h-195'>
            <Dither
                waveColor={[0.30980392156862746, 0.30980392156862746, 0.30980392156862746]}
                disableAnimation={false}
                enableMouseInteraction
                mouseRadius={0.3}
                colorNum={4}
                pixelSize={2}
                waveAmplitude={0.3}
                waveFrequency={3}
                waveSpeed={0.05}
            />
        </div>
        <HeroHeader/>
        {children}
        <FooterSection/>
        <Analytics/>
        </body>
        </html>
    )
}
