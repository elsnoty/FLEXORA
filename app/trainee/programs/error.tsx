'use client';

export default function ProgramError({
    error,
    reset,
    }: {
    error: Error & { digest?: string };
    reset: () => void;
    }) {
    return (
        <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-destructive">Program Unavailable</h2>
        <p className="my-4">We couldn&apos;t load this program</p>
        <button
            onClick={reset}
            className="bg-primary px-4 py-2 rounded text-primary-foreground"
        >
            Reload Program
        </button>
        </div>
    );
}