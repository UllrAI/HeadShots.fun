'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Confetti } from '@/components/shared/success-confetti';
import { useTranslations } from 'next-intl';

export function PaymentStatus() {
    const t = useTranslations('payment-status');
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const sessionId = searchParams?.get('session_id');
        if (!sessionId) {
            setError(t('missing_session_id'));
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
    }, [searchParams, t]);

    const handleRedirect = () => {
        router.push(status === 'completed' ? '/dashboard' : '/pricing');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                    {t('loading')}
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {status === 'completed' && <Confetti />}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">
                        {t('title')}
                    </CardTitle>
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
                            <p className="text-success text-center text-2xl">🥳 {t('success')}</p>
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="text-warning mb-4 size-16 animate-pulse text-yellow-500" />
                            <p className="text-warning text-center text-2xl">
                                {t('processing')}
                            </p>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleRedirect}
                        className="w-full"
                        variant={status === 'completed' ? 'default' : 'secondary'}
                    >
                        {status === 'completed' ? t('go_to_dashboard') : t('return_to_pricing')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}