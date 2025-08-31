import { ReactNode, useEffect, useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: ReactNode;
  isHost?: boolean;
}

const ProtectedRoute = ({ children, isHost = false }: ProtectedRouteProps) => {
  // In a real application, you would check authentication/authorization here
  // For now, we'll simulate host access with a simple check
  // You can replace this with actual authentication logic
  
  // Simplified admin gate: allow when on localhost or when ?key= matches VITE_ADMIN_KEY env.
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(()=> {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const required = import.meta.env.VITE_ADMIN_KEY;
    const hostOk = ['localhost','127.0.0.1',''].includes(window.location.hostname);
    const ok = hostOk || (required && key === required);
    setIsAdmin(ok);
  }, []);

  if (isAdmin === null) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Checking access…</div>;
  }
  const hasAdminAccess = isHost ? isAdmin : true;

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-[var(--shadow-card)]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-destructive/10 p-3 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              This area is restricted to authorized administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">
                You don't have permission to access the admin portal. 
                Please contact your system administrator if you believe this is an error.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Admin access required (provide ?key= or use localhost)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button className="flex-1" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
