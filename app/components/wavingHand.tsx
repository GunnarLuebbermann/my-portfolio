"use client";

export default function WavingHand() {
    return (
        <span
            className="inline-block text-2xl sm:text-3xl md:text-4xl cursor-default select-none animate-wave-hand"
            style={{ transformOrigin: "70% 70%" }}
        >
            👋
        </span>
    );
}
