'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'false')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 mx-auto max-w-xs shadow-lg md:max-w-md">
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">
          We use cookies to improve your experience. By using, you agree to our{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            policy
          </Link>. To decline, please close the page.
        </p>
        <div className="flex justify-end">
          <Button size="sm" onClick={acceptCookies}>
            Got it
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CookieConsent