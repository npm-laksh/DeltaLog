import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function JournalEntry() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
  });

  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const now = new Date();
    const newTask = {
      ...formData,
      id: Date.now(),
      createdAt: now.toLocaleString(),
      updatedAt: now.toLocaleString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setFormData({ title: "", description: "", status: "To Do" });
    setOpen(false);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // opens modal & fills form with task data
  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setOpen(true);
  };

  // save task data logic
  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    if (editingTaskId) {
      // update logic
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, ...formData, updatedAt: new Date().toLocaleString() }
            : task,
        ),
      );
    } else {
      // create task logic
      const newTask = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    // reset everything
    setFormData({ title: "", description: "", status: "To Do" });
    setEditingTaskId(null);
    setOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>

        {/* <Dialog open={open} onOpenChange={setOpen}> */}
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setEditingTaskId(null); // clear edit state on close
              setFormData({ title: "", description: "", status: "To Do" });
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
                Create Task
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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add some details..."
                  className="resize-none bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    align="start"
                    sideOffset={4}
                    className="z-[110] w-[var(--radix-select-trigger-width)] bg-white text-black shadow-lg border border-slate-200"
                  >
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <Button
                onClick={handleSaveTask}
                variant="outline"
                className="px-8"
              >
                {editingTaskId ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-background border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                {/* Left Column: Title and Description */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-foreground leading-none">
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-2">
                    Created: {task.createdAt}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border whitespace-nowrap">
                    {task.status}
                  </span>

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
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
