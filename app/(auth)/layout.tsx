import { authMetadata } from "@/lib/auth-metadata";

interface AuthLayoutProps {
    children: React.ReactNode;
    params: Promise<{ segment?: string }>; 
}

export async function generateMetadata({ params }: { params: Promise<{ segment?: string }> }) {
    const resolvedParams = await params;
    return resolvedParams.segment ? authMetadata[resolvedParams.segment] : authMetadata.login;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return <>{children}</>;
}