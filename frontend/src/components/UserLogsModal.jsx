import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Card, CardContent } from "../components/ui/card";
import {
  Clock,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import {
  getUserAttendanceHistory,
  getTasksByAttendanceId,
} from "../services/adminServices";
import { toast } from "sonner";

export default function UserLogsModal({ open, onOpenChange, user }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  
  // cache tasks per attendance ID in object map: { [attendanceId]: [tasks] }
  const [tasksMap, setTasksMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [loadingTasksId, setLoadingTasksId] = useState(null);

  // lazy load attendance sessions list when modal opens
  useEffect(() => {
    if (open && user?.email) {
      const fetchHistory = async () => {
        try {
          setLoadingAttendance(true);
          const data = await getUserAttendanceHistory(user.email);
          setAttendanceRecords(data || []);
          
          // clear prev states
          setExpandedId(null);
          setTasksMap({});
        } catch (err) {
          toast.error("Could not fetch user historical records.");
        } finally {
          setLoadingAttendance(false);
        }
      };
      fetchHistory();
    }
  }, [open, user?.email]);

  // aggregate num from all loaded sessions
  const overallMetrics = attendanceRecords.reduce(
    (acc, cur) => {
      acc.totalRegularMin += cur.totalWorkMin || 0;
      acc.totalOvertimeMin += cur.overtime || 0;
      acc.totalUndertimeMin += cur.undertime || 0;
      return acc;
    },
    { totalRegularMin: 0, totalOvertimeMin: 0, totalUndertimeMin: 0 }
  );

  const toggleRowExpand = async (attendanceId) => {
    if (expandedId === attendanceId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(attendanceId);

    if (!tasksMap[attendanceId]) {
      try {
        setLoadingTasksId(attendanceId);
        const tasks = await getTasksByAttendanceId(attendanceId);
        setTasksMap(prev => ({ ...prev, [attendanceId]: tasks || [] }));
      } catch (err) {
        toast.error("Failed to recover tasks linked to this shift session.");
      } finally {
        setLoadingTasksId(null);
      }
    }
  };

  const formatDateTime = (rawStr) => {
    if (!rawStr) return " -- ";
    return new Date(rawStr).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
  };

  const formatMinutes = (mins) => {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hours > 0 ? `${hours}h ${remMins}m` : `${remMins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 text-black dark:text-white border border-slate-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader className="border-b dark:border-zinc-800 pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-500 dark:text-zinc-400" /> Work Session & Task Log
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Reviewing session metrics and submitted tasks for <strong>{user?.name}</strong> ({user?.email})
          </p>
        </DialogHeader>

        {!loadingAttendance && attendanceRecords.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {/* Total Regular Time Card */}
            <Card className="bg-slate-50/50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/80 shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Regular Time</p>
                  <p className="text-lg font-mono font-bold mt-0.5 text-blue-600 dark:text-blue-400">
                    {formatMinutes(overallMetrics.totalRegularMin)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Overtime Card */}
            <Card className="bg-slate-50/50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/80 shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Accumulated Overtime</p>
                  <p className="text-lg font-mono font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">
                    {formatMinutes(overallMetrics.totalOvertimeMin)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50/50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800/80 shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Undertime</p>
                  <p className="text-lg font-mono font-bold mt-0.5 text-amber-600 dark:text-amber-400">
                    {formatMinutes(overallMetrics.totalUndertimeMin)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">
            Historical Session Breakdowns
          </h3>

          {loadingAttendance ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">
              Syncing shifts history from server...
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl dark:border-zinc-800">
              No work session & task found for this employee
            </div>
          ) : (
            attendanceRecords.map((record) => {
              const isExpanded = expandedId === record.id;
              const sessionTasks = tasksMap[record.id] || [];
              const isSessionLoading = loadingTasksId === record.id;

              return (
                <div key={record.id} className="border dark:border-zinc-800 rounded-xl overflow-hidden bg-background shadow-sm transition-all">
                  
                  <div
                    onClick={() => toggleRowExpand(record.id)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors select-none rounded-t-xl ${
                      isExpanded 
                        ? "bg-slate-50 dark:bg-zinc-900/40 font-medium" 
                        : "hover:bg-slate-50/60 dark:hover:bg-zinc-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-600 dark:text-zinc-400 hidden sm:block">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">Session #{record.id}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                            record.status === "COMPLETED" 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" 
                              : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                          }`}>
                            {record.status === "COMPLETED" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {record.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex gap-3 flex-wrap">
                          <span><strong>In:</strong> {formatDateTime(record.checkInTime)}</span>
                          <span><strong>Out:</strong> {formatDateTime(record.checkOutTime)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-foreground">{formatMinutes(record.totalWorkMin)}</p>
                        <p className="text-[10px] text-muted-foreground">Work Time</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/10 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Logged Task Items Snapshot
                      </h4>

                      {isSessionLoading ? (
                        <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">
                          Querying database for session tasks...
                        </div>
                      ) : sessionTasks.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground border-2 border-dashed rounded-lg bg-background dark:border-zinc-800">
                          Employee checked out without logging or submitting task items for this shift.
                        </div>
                      ) : (
                        <div className="grid gap-2.5">
                          {sessionTasks.map((task) => (
                            <Card key={task.id} className="shadow-none border dark:border-zinc-800 bg-background">
                              <CardContent className="p-3.5 flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <h5 className="font-bold text-sm text-foreground leading-snug">{task.title}</h5>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                                  {task.createdAt && (
                                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 pt-1">
                                      Time Logged: {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  )}
                                </div>
                                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border dark:border-zinc-800 flex items-center gap-1 whitespace-nowrap">
                                  <Clock className="w-3 h-3 text-slate-400" /> {task.durationMinutes}m
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}