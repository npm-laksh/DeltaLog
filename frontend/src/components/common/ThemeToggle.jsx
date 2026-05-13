import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const currentTheme =
    theme === "system" ? "light" : theme

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() =>
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
    >
      {currentTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}