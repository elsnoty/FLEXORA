import { authMetadata } from "@/lib/auth-metadata";

interface AuthLayoutProps {
    children: React.ReactNode;
    params: { segment?: string };
}

export async function generateMetadata({ params }: { params: { segment?: string } }) {
  // Dynamically select metadata based on route segment
    return params.segment ? authMetadata[params.segment] : authMetadata.login;
}

export default function AuthLayout({ children, params }: AuthLayoutProps) {
    return (
        <html lang="en">
        <body>
            {children}
        </body>
        </html>
    );
}