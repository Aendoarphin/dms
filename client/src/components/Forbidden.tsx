import { ShieldAlert } from "lucide-react";

import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Forbidden() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-3xl">403</CardTitle>
          <CardDescription className="text-xl font-semibold">Access Forbidden</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to access this resource. Please contact your administrator if you believe this is
            an error.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/login">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
