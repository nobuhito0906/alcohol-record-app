import { Amplify } from 'aws-amplify'
import { Inter } from 'next/font/google'
import '@aws-amplify/ui-react/styles.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    }
  },
  API: {
    REST: {
      alcoholAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        region: process.env.NEXT_PUBLIC_REGION!,
      }
    }
  }
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gradient-to-br from-primary/10 to-secondary/10 min-h-screen`}>
        <main className="container mx-auto p-4 flex items-center justify-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}