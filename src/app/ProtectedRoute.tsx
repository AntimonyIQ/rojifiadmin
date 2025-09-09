import { session, SessionData } from "@/session/session";
import { Redirect, useRoute } from "wouter";

export function ProtectedRoute({
    path,
    children,
}: {
    path: string;
    children: React.ReactNode;
}) {
    const sd: SessionData = session.getUserData();
    const [match] = useRoute(path);

    // If the route doesn't match, don't render anything (let other routes handle it)
    if (!match) return null;

    // Check if user is actually logged in
    if (!sd || !sd.isLoggedIn) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
}
