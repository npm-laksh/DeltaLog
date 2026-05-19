import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import DemoCalendarComponent from "../components/DemoCalendarComponent";
import JournalEntry from "../components/JournalEntry";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getLatestAttendance } from "../services/checkin";
import { getTasksByDate } from "../services/fetchTasksByDate";
import { formatDateString } from "../utils/formatDateString";
import { toast } from "sonner";

export default function UserDashboardPage() {
  const [liveDuration, setLiveDuration] = useState("00:00:00");
  const [attendance, setAttendance] = useState(null);
  
  // calendar date & task tracking status
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // load latest attendance data
  useEffect(() => {
    const loadData = async () => {
      const data = await getLatestAttendance();
      setAttendance(data);
    };
    loadData();
  }, []);

  // fetch tasks based on date / calendar day

useEffect(() => {
  const loadHistoricalTasks = async () => {
    try {
      setTasksLoading(true);
      setTasks([]); 

      const targetDateStr = formatDateString(selectedDate);
      const data = await getTasksByDate(targetDateStr);
      setTasks(data || []);
    } catch (err) {
      setTasks([]); 
      toast.error("Could not fetch workspace records for this date.");
    } finally {
      setTasksLoading(false);
    }
  };

  loadHistoricalTasks();
}, [selectedDate]);

  useEffect(() => {
    let interval;
    if (attendance && attendance.status === "ACTIVE") {
      interval = setInterval(() => {
        const start = new Date(attendance.checkInTime).getTime();
        const now = new Date().getTime();
        const diffInMs = now - start;

        const hours = Math.floor(diffInMs / 3600000).toString().padStart(2, "0");
        const mins = Math.floor((diffInMs % 3600000) / 60000).toString().padStart(2, "0");
        const secs = Math.floor((diffInMs % 60000) / 1000).toString().padStart(2, "0");

        setLiveDuration(`${hours}:${mins}:${secs}`);
      }, 1000);

      // if completed, show the total work min from backend
    } else if (attendance && attendance.status === "COMPLETED") {
      const hours = Math.floor(attendance.totalWorkMin / 60);
      const mins = attendance.totalWorkMin % 60;
      setLiveDuration(`${hours}h ${mins}m`);
    }

    return () => clearInterval(interval);
  }, [attendance]);

  const formatTimeData = (dateString) => {
    if (!dateString) return " -- ";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = formatDateString(selectedDate) === formatDateString(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6">
        <div className="flex flex-wrap justify-evenly gap-6 w-full items-start mb-8">
          <Card className="w-52 h-28">
            <CardHeader>
              <CardTitle className="text-sm">Check In Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatTimeData(attendance?.checkInTime)}
              </p>
            </CardContent>
          </Card>

          <Card className="w-52 h-28">
            <CardHeader>
              <CardTitle className="text-sm">Check Out Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatTimeData(attendance?.checkOutTime)}
              </p>
            </CardContent>
          </Card>

          <Card className="w-52 h-28 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">
                {attendance?.status === "ACTIVE" ? "Live Duration" : "Total Duration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-mono text-primary">
                {attendance?.status === "ACTIVE"
                  ? liveDuration
                  : attendance?.status === "COMPLETED"
                    ? `${Math.floor(attendance.totalWorkMin / 60)}h ${attendance.totalWorkMin % 60}m`
                    : "00:00"}
              </p>
            </CardContent>
          </Card>

          <DemoCalendarComponent 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
          />
        </div>

        <JournalEntry 
          tasks={tasks} 
          setTasks={setTasks}
          loading={tasksLoading} 
          isEditable={isToday} 
          selectedDate={selectedDate}
        />
      </main>
    </div>
  );
}