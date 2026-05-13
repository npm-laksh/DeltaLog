import { Button } from "../ui/button";
import { handleLogOut } from "../../services/logout";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("userRole");

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        <h1 className="text-sm font-medium tracking-tight text-foreground">
          Hola {username}!
        </h1>

        <div className="flex px-5 gap-2">
          <ThemeToggle />
        {userRole === "ADMIN" && (
          <Button
          variant="outline"
          onClick={() => navigate("/register-user")}
          className="h-9 rounded-full px-5 text-sm"
          >
            Register user
          </Button>
        )}
          <Button variant="outline" className="h-9 rounded-full px-5 text-sm">
            Check In
          </Button>
          <Button variant="outline" onClick={handleLogOut} className="h-9 rounded-full px-5 text-sm">
            Log out
          </Button>
        </div>

      </div>
    </header>
  );
}
