import { useAuth } from "@/hooks/useAuth";
import { Redirect, useRoute } from "wouter";

export function ProtectedRoute({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [match] = useRoute(path);

  if (!match) return null;

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
