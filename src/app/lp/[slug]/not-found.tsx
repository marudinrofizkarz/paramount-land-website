import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The landing page you're looking for doesn't exist or is no longer
            available.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>

          <Button variant="outline" asChild className="w-full border-border">
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
