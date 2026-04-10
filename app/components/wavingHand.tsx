"use client";

export default function WavingHand() {
    return (
        <span
            className="inline-block text-2xl sm:text-3xl md:text-4xl cursor-default select-none animate-wave"
            style={{ transformOrigin: "70% 70%" }}
        >
            👋
            <style jsx>{`
                @keyframes wave {
                    0%   { transform: rotate(0deg) scale(1); }
                    15%  { transform: rotate(20deg) scale(1.1); }
                    30%  { transform: rotate(-10deg) scale(1); }
                    45%  { transform: rotate(20deg) scale(1.1); }
                    60%  { transform: rotate(-5deg) scale(1); }
                    75%  { transform: rotate(15deg) scale(1.05); }
                    100% { transform: rotate(0deg) scale(1); }
                }
                .animate-wave {
                    animation: wave 2.5s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>
        </span>
    );
}
