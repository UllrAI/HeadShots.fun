'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function PaymentStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    if (!sessionId) {
      setError('Missing session ID');
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/check-payment-status?session_id=${sessionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setStatus(data.status);
        }
      })
      .catch(err => {
        console.error('Error checking payment status:', err);
        setError('Failed to check payment status');
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleRedirect = () => {
    router.push(status === 'completed' ? '/dashboard' : '/pricing');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold text-foreground">Checking payment status...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {error ? (
            <>
              <XCircle className="mb-4 size-16 text-destructive" />
              <p className="text-center text-lg text-destructive">{error}</p>
            </>
          ) : status === 'completed' ? (
            <>
              <CheckCircle className="text-success mb-4 size-16 animate-pulse text-green-500" />
              <p className="text-success text-center text-2xl">🥳 Payment successful!</p>
            </>
          ) : (
            <>
              <AlertTriangle className="text-warning mb-4 size-16 animate-pulse text-yellow-500" />
              <p className="text-warning text-center text-2xl">Payment is still processing.</p>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRedirect}
            className="w-full"
            variant={status === 'completed' ? 'default' : 'secondary'}
          >
            {status === 'completed' ? 'Go to Dashboard' : 'Return to Pricing'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="size-16 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold text-foreground">Loading payment status...</p>
      </div>
    }>
      <PaymentStatus />
    </Suspense>
  );
}