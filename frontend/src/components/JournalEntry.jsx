import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Toaster, toast } from "sonner";
import { createNewTask } from "../services/createTask";
import { deleteTaskById } from "../services/deleteTaskById";
import { updateTaskById } from "../services/updateTaskById";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

export default function JournalEntry({
  tasks,
  setTasks,
  loading,
  isEditable,
  selectedDate,
  attendance,
}) {
  const [open, setOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationMinutes: 30,
  });

  const handleOpenCreateTaskModal = () => {
    if (!attendance || attendance.status !== "ACTIVE") {
      toast.error("Please check in before creating task");
      return;
    }
    setOpen(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskById(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task removed from log.");
    } catch (err) {
      const backendError =
        err.response?.data?.message || "Failed to remove task from server.";
      toast.error(backendError);
    }
  };

  const handleEditClick = (task) => {
    if (!attendance || attendance.status !== "ACTIVE") {
      toast.error(
        "Cannot modify tasks. Your attendance session is not active.",
      );
      return;
    }

    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      durationMinutes: task.durationMinutes || 30,
    });
    setOpen(true);
  };

  const handleSaveTask = async () => {
    if (!formData.title.trim()) return;

    const targetUserId = attendance?.userId;

    if (!targetUserId) {
      toast.error("User context data could not be verified. Action blocked.");
      return;
    }

    const payload = {
      userId: String(targetUserId),
      title: formData.title,
      description: formData.description,
      durationMinutes: String(formData.durationMinutes),
    };

    if (editingTaskId) {
      try {
        const updatedTaskFromDB = await updateTaskById(editingTaskId, payload);

        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId ? updatedTaskFromDB : task,
          ),
        );

        toast.success("Task updated successfully in the database.");

        setFormData({ title: "", description: "", durationMinutes: 30 });
        setEditingTaskId(null);
        setOpen(false);
      } catch (err) {
        const backendError =
          err.response?.data?.message ||
          "Task updates rejected by backend server.";
        toast.error(backendError);
      }
    } else {
      try {
        const savedTaskFromDB = await createNewTask(payload);

        setTasks((prev) => [savedTaskFromDB, ...prev]);
        toast.success("Task successfully saved to your timesheet.");

        setFormData({ title: "", description: "", durationMinutes: 30 });
        setOpen(false);
      } catch (err) {
        const backendError =
          err.response?.data?.message ||
          "Task insertion rejected by backend server.";
        toast.error(backendError);
      }
    }
  };

  const formatTaskDate = (rawDateTime) => {
    if (!rawDateTime) return "";
    return new Date(rawDateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-muted-foreground animate-pulse">
        Syncing day logs from server...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditable
              ? "Add and manage logs for today's workspace session."
              : "Viewing archived workspace files. Changes are locked."}
          </p>
        </div>

        {isEditable && (
          <div>
            <Button
              className="gap-2"
              variant="outline"
              onClick={handleOpenCreateTaskModal}
            >
              <Plus className="w-4 h-4" /> Add New Task
            </Button>

            <Dialog
              open={open}
              onOpenChange={(val) => {
                setOpen(val);
                if (!val) {
                  setEditingTaskId(null);
                  setFormData({
                    title: "",
                    description: "",
                    durationMinutes: 30,
                  });
                }
              }}
            >
              <DialogContent className="sm:max-w-lg bg-white text-black border border-slate-200 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editingTaskId ? "Modify Task Entry" : "Create Task"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="What needs to be done?"
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Add some details..."
                      className="resize-none bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Duration
                    </label>
                    <Select
                      value={String(formData.durationMinutes)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          durationMinutes: parseInt(value) || 30,
                        })
                      }
                    >
                      <SelectTrigger className="bg-white border-slate-200 dark:border-grey-800 text-black dark:text-dark">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>

                      <SelectContent className="bg-white text-black border border-slate-200 ">
                        <SelectItem value="15">15 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="45">45 Minutes</SelectItem>
                        <SelectItem value="60">1 Hour (60 mins)</SelectItem>
                        <SelectItem value="90">1.5 Hours (90 mins)</SelectItem>
                        <SelectItem value="120">2 Hours (120 mins)</SelectItem>
                        <SelectItem value="180">3 Hours (180 mins)</SelectItem>
                        <SelectItem value="240">4 Hours (240 mins)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center mt-2">
                  <Button
                    onClick={handleSaveTask}
                    variant="default"
                    className="px-8 font-semibold "
                  >
                    {editingTaskId ? "Update Task" : "Create Task"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          No tasks logged
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-background border shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-foreground leading-none">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                    {task.createdAt && (
                      <p className="text-[10px] text-slate-400 pt-2">
                        Logged at: {formatTaskDate(task.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-muted text-muted-foreground border whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.durationMinutes || 0}{" "}
                      mins
                    </span>

                    {isEditable && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}
