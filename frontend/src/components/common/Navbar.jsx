import { Button } from "../ui/button";
import { handleLogOut } from "../../services/logout";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkin, checkout, getLatestAttendance } from "../../services/checkin";
import { 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialog, 
  AlertDialogContent ,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "../ui/alert-dialog";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("userRole");

  const [isWorking, setIsWorking] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  // latest attendance status data
  useEffect(() => {
    const syncStatus = async () => {
      const data = await getLatestAttendance();
      if (data && data.status === "ACTIVE") {
        setIsWorking(true);
      } else {
        setIsWorking(false);
      }
    };
    syncStatus();
  }, []);

  // logic to decide whether to check-in immediately or show the popup
  const handleMainButtonClick = () => {
    if (!isWorking) {
      // execute check in
      handleAttendance();
    } else {
      // show checkout confirmation dialog
      setIsConfirm(true);
    }
  };

  // api call for check in & check out
  const handleAttendance = async () => {
    try {
      if (!isWorking) {
        await checkin();
        setIsWorking(true);
      } else {
        await checkout();
        setIsWorking(false);
        setIsConfirm(false); 
      }
      // update dashboard
      window.location.reload();
    } catch (error) {
      console.error("Attendance action failed", error);
    }
  };

  return (
    <>
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
            
            <Button
              variant={isWorking ? "destructive" : "outline"}
              onClick={handleMainButtonClick}
              className="h-9 rounded-full px-5 text-sm"
            >
              {isWorking ? "Check Out" : "Check In"}
            </Button>

            <Button
              variant="outline"
              onClick={handleLogOut}
              className="h-9 rounded-full px-5 text-sm"
            >
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* checkout confirmation popup */}
      <AlertDialog open={isConfirm} onOpenChange={setIsConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Check-out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end your work session now? This will
              finalize your total working hours for today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAttendance}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}