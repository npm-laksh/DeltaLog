import Navbar from "../components/common/Navbar";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-muted/30 px-6">
        <Card className="w-full max-w-2xl border-border shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>

            {/* Error Code */}
            <h1 className="text-7xl font-extrabold tracking-tight text-foreground">
              404
            </h1>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              Page not found
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Sorry, the page you are looking for doesn&apos;t exist
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-full px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              {/* <Button
                onClick={() => navigate("/user-dashboard")}
                className="rounded-full px-6"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}