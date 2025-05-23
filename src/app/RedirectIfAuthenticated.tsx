import { useAuth } from "@/hooks/useAuth";
import { Redirect, useRoute } from "wouter";

export function RedirectIfAuthenticated({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [match] = useRoute(path);

  if (!match) return null;

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}
