import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { deleteTaskById } from "../services/deleteTaskById";
import { toast } from "sonner";

export default function JournalEntry({ tasks, setTasks, loading, isEditable, selectedDate }) {
  const [open, setOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationMinutes: 30,
  });

  const handleDeleteTask = async (id) => {
    try {
      // send path param to backend 
      await deleteTaskById(id);
      
      // remove deleted task from ui
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task removed from log.");
    } catch (err) {
      const backendError = err.response?.data?.message || "Failed to remove task from server.";
      toast.error(backendError);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      durationMinutes: task.durationMinutes || 30,
    });
    setOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, ...formData }
            : task,
        ),
      );
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setFormData({ title: "", description: "", durationMinutes: 30 });
    setEditingTaskId(null);
    setOpen(false);
  };

  const formatTaskDate = (rawDateTime) => {
    if (!rawDateTime) return "";
    return new Date(rawDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setEditingTaskId(null);
                setFormData({ title: "", description: "", durationMinutes: 30 });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2" variant="outline">
                <Plus className="w-4 h-4" /> Add New Task
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-white text-black border border-slate-200 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingTaskId ? "Modify Task Entry" : "Create Task"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What needs to be done?"
                    className="bg-white border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add some details..."
                    className="resize-none bg-white border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Duration (Minutes)</label>
                  <Input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <Button onClick={handleSaveTask} variant="outline" className="px-8">
                  {editingTaskId ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          No tasks logged for this calendar date window.
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
                    {/* Displaying duration minutes matching your dynamic DTO properties */}
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-muted text-muted-foreground border whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.durationMinutes || 0} mins
                    </span>

                    {isEditable && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          onClick={() => handleDeleteTask(task.id)} 
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}