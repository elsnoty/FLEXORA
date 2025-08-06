// app/trainee/error.tsx
'use client';

export default function TraineeDashboardError({
    error,
    reset,
    children,
    }: {
    error?: Error & { digest?: string };
    reset?: () => void;
    children: React.ReactNode;
    }) {
    if (error) {
        return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
            Dashboard Error
            </h1>
            <p className="mb-6">{error.message}</p>
            <button
            onClick={reset}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            >
            Reload Dashboard
            </button>
        </div>
        );
    }

    return <>{children}</>;
}