import type { Metadata } from 'next'
import { Inter, Permanent_Marker } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ToastContainer } from '@/components/ui/toast'
import TermsPopup from '@/components/ui/terms-popup'
import { CookieConsent } from '@/components/ui/cookie-consent'
import { ChatWidget } from '@/components/ai-doctor/chat-widget'
import { WalletContextProvider } from '@/components/wallet/wallet-provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const permanentMarker = Permanent_Marker({
  variable: '--font-permanent-marker',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Dark Pino Peptides - Premium Research Peptides',
  description:
    'Premium quality research peptides for advanced researchers and enthusiasts. Secure checkout, fast shipping, and exceptional purity standards.',
  keywords: ['peptides', 'research', 'premium', 'dark pino', 'lab', 'science'],
  authors: [{ name: 'Dark Pino Peptides' }],
  creator: 'Dark Pino Peptides',
  publisher: 'Dark Pino Peptides',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://darkpinopeptides.com',
    title: 'Dark Pino Peptides - Premium Research Peptides',
    description:
      'Premium quality research peptides for advanced researchers and enthusiasts.',
    siteName: 'Dark Pino Peptides',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dark Pino Peptides - Premium Research Peptides',
    description:
      'Premium quality research peptides for advanced researchers and enthusiasts.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${permanentMarker.variable} font-sans antialiased bg-slate-950 text-white min-h-screen`}>
        <WalletContextProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <TermsPopup />
          <CookieConsent />
          <ChatWidget />
          <ToastContainer />
        </WalletContextProvider>
      </body>
    </html>
  )
}
