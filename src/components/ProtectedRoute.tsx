import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
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
  
  // For demo purposes, let's check if the user is accessing from localhost or has admin privileges
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  const hasAdminAccess = isHost && isLocalhost;

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
                <span>Admin access required</span>
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
