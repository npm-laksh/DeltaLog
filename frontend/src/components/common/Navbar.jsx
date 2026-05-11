import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        <h1 className="text-sm font-medium tracking-tight text-foreground">
          Welcome User
        </h1>

        <div className="flex px-5 gap-2">
          <ThemeToggle />
          <Button variant="outline" className="h-9 rounded-full px-5 text-sm">
            Check In
          </Button>
          <Button variant="outline" className="h-9 rounded-full px-5 text-sm">
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
