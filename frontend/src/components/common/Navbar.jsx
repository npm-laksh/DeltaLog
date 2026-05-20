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
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { toast, Toaster } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("userRole");

  const [isWorking, setIsWorking] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  // track shift
  const [isCompleted, setIsCompleted] = useState(false);

  // latest attendance status data + check shift
  useEffect(() => {
    const syncStatus = async () => {
      try {
        const data = await getLatestAttendance();

        if (data) {
          if (data.status === "ACTIVE") {
            setIsWorking(true);
            setIsCompleted(false);
          } else if (data.status === "COMPLETED") {
            setIsWorking(false);

            // check if check out is from todays date
            if (data.checkOutTime) {
              const checkOutDate = new Date(data.checkOutTime).toDateString();
              const todayDate = new Date().toDateString();

              if (checkOutDate === todayDate) {
                setIsCompleted(true);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error syncing status:", error);
      }
    };
    syncStatus();
  }, []);

  const getButtonText = () => {
  if (isWorking) return "Check Out";
  if (isCompleted) return "Shift Completed";
  return "Check In";
};


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
        setIsCompleted(true); // lock after checking out
        setIsConfirm(false);
      }
      // update dashboard
      window.location.reload();
    } catch (error) {
      console.error("Attendance action failed", error);
      const msg = "Attendance update denied";
      toast.error(msg);
    }
  };

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 items-center justify-between px-6">
          <h1 className="text-l font-medium tracking-tight text-foreground">
            Hola {username} !
          </h1>

          <div className="flex px-5 gap-2">
            <ThemeToggle />
            {userRole === "ADMIN" && (
              <Button
                variant="outline"
                onClick={() => navigate("/manage-user")}
                className="h-9 rounded-full px-5 text-sm"
              >
                Manage users
              </Button>
            )}

            <Button
              variant={isWorking ? "destructive" : "outline"}
              onClick={handleMainButtonClick}
              disabled={isCompleted} // disable interaction if completed today
              className={`h-9 rounded-full px-5 text-sm transition-all ${
                isCompleted
                  ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                  : ""
              }`}
            >
              {getButtonText()}
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
      <Toaster />
    </>
  );
}
