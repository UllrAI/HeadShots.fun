"use client";

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
    duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ duration = 8000 }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!showConfetti) return null;

    return <ReactConfetti recycle={false} />;
};